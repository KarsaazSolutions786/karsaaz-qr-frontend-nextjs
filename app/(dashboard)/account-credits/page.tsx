'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { accountCreditsAPI, type CreditTransaction } from '@/lib/api/endpoints/account-credits'
import { PayPalAccountCredit } from '@/components/features/payment/PayPalAccountCredit'
import { AccountCreditCart } from '@/components/features/payment/AccountCreditCart'
import { useAuth } from '@/lib/context/AuthContext'
import { Wallet, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes AccountCreditsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function AccountCreditsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const {
    balance,
    refreshBalance,
    isAccountCreditMode,
    dynamicQRPrice,
    staticQRPrice,
  } = useAccountCredit()
  const [history, setHistory] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    accountCreditsAPI
      .getHistory(user.id)
      .then((res) => setHistory(res.data ?? []))
      .catch(() => { toast.error('Failed to load credit history') })
      .finally(() => setLoading(false))
  }, [user?.id])

  // If credit mode is not active, show informational message
  if (!isAccountCreditMode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{t('Account Credits Not Available')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('The system is currently using subscription-based billing. Account credit billing is not enabled.')}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('Account Credits')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('Manage your account balance and purchase credits')}</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('Current Balance')}</p>
              <p className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</p>
            </div>
          </div>
          {/* Pricing info */}
          <div className="hidden sm:flex gap-4 text-sm text-gray-500">
            {dynamicQRPrice > 0 && (
              <div className="text-center">
                <p className="font-semibold text-gray-900">${dynamicQRPrice.toFixed(2)}</p>
                <p className="text-xs">{t('per Dynamic QR')}</p>
              </div>
            )}
            {staticQRPrice > 0 && (
              <div className="text-center">
                <p className="font-semibold text-gray-900">${staticQRPrice.toFixed(2)}</p>
                <p className="text-xs">{t('per Static QR')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Funds */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Add Funds')}</h2>
          <PayPalAccountCredit />
        </div>

        {/* Cart */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Shopping Cart')}</h2>
          <AccountCreditCart />
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">{t('Credit History')}</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">{t('Loading...')}</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('No credit transactions yet')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description || (tx.type === 'credit' ? t('Credit Added') : t('Credit Used'))}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { accountCreditsAPI, type CreditTransaction } from '@/lib/api/endpoints/account-credits'
import { PayPalAccountCredit } from '@/components/features/payment/PayPalAccountCredit'
import { AccountCreditCart } from '@/components/features/payment/AccountCreditCart'
import { useAuth } from '@/lib/context/AuthContext'
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function AccountCreditsPage() {
  const { user } = useAuth()
  const { balance, refreshBalance } = useAccountCredit()
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
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Credits</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account balance and purchase credits</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Funds */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Funds</h2>
          <PayPalAccountCredit />
        </div>

        {/* Cart */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <AccountCreditCart />
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Credit History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No credit transactions yet</div>
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
                    <p className="text-sm font-medium text-gray-900">{tx.description || (tx.type === 'credit' ? 'Credit Added' : 'Credit Used')}</p>
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

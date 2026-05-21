'use client'

import { use } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useTransaction } from '@/lib/hooks/queries/useTransactions'
import type { Transaction } from '@/types/entities/transaction'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes StatusBadge functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function StatusBadge({ status }: { status?: string }) {
  const s = status?.toLowerCase() ?? ''
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[s] ?? 'bg-gray-100 text-gray-700'}`}>
      {status ?? '—'}
    </span>
  )
}

/**
 * Purpose: Executes formatAmount functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function formatAmount(t: Transaction): string {
  if (t.formatted_amount) return t.formatted_amount
  if (t.amount != null) {
    const amt = t.amount > 100 ? t.amount / 100 : t.amount
    return `${t.currency ?? ''} ${amt.toFixed(2)}`.trim()
  }
  return '—'
}

/**
 * Purpose: Executes InfoRow functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-3">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  )
}

/**
 * Purpose: Executes TransactionDetailPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const { id } = use(params)
  const { data: transaction, isLoading } = useTransaction(Number(id))

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-medium text-gray-900">{t('Transaction not found')}</h2>
        <Link href="/transactions" className="mt-2 text-sm text-blue-600 hover:text-blue-900">{t('← Back to transactions')}</Link>
      </div>
    )
  }

  const date = transaction.createdAt || transaction.created_at
  const stripeId = transaction.stripe_payment_intent_id || transaction.stripePaymentIntentId

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Transaction Detail')}</h1>
          <p className="mt-1 text-sm text-gray-500">ID: {transaction.id}</p>
        </div>
        <Link href="/transactions" className="text-sm text-blue-600 hover:text-blue-900">{t('← Back')}</Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Amount header */}
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('Amount')}</p>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(transaction)}</p>
            </div>
            <StatusBadge status={transaction.status} />
          </div>
        </div>

        {/* Details */}
        <dl className="px-6 py-2">
          <InfoRow label={t('Type')}>
            <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {transaction.type?.replace('_', ' ') || '—'}
            </span>
          </InfoRow>

          <InfoRow label={t('Source')}>
            {transaction.source || '—'}
          </InfoRow>

          <InfoRow label={t('User')}>
            {transaction.user_name || (transaction.userId ? `User #${transaction.userId}` : '—')}
          </InfoRow>

          <InfoRow label={t('Subscription Plan')}>
            {transaction.subscription_plan_name || (transaction.subscriptionId ? `#${transaction.subscriptionId}` : '—')}
          </InfoRow>

          <InfoRow label={t('Gateway / Stripe ID')}>
            {stripeId ? (
              <span className="font-mono text-xs text-gray-500" title={stripeId}>{stripeId}</span>
            ) : '—'}
          </InfoRow>

          <InfoRow label={t('Description')}>
            {transaction.description || '—'}
          </InfoRow>

          <InfoRow label={t('Created')}>
            {date ? new Date(date).toLocaleString() : '—'}
          </InfoRow>

          {transaction.updatedAt && (
            <InfoRow label={t('Updated')}>
              {new Date(transaction.updatedAt).toLocaleString()}
            </InfoRow>
          )}

          {transaction.payment_proof && (
            <InfoRow label={t('Payment Proof')}>
              <a
                href={transaction.payment_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-900"
              >
                {t('View Proof')}
              </a>
            </InfoRow>
          )}
        </dl>
      </div>
    </div>
  )
}

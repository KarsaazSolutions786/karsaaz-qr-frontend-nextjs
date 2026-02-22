'use client'

import { useEffect, useState } from 'react'
import { withdrawalsAPI } from '@/lib/api/endpoints/withdrawals'
import type { WithdrawalRequest } from '@/types/entities/referral'

const STATUS_STYLES: Record<WithdrawalRequest['status'], { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  approved: { bg: 'bg-blue-50', text: 'text-blue-700' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
  paid: { bg: 'bg-green-50', text: 'text-green-700' },
}

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  crypto: 'Crypto',
}

interface WithdrawalHistoryProps {
  refreshKey?: number
}

export function WithdrawalHistory({ refreshKey }: WithdrawalHistoryProps) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    withdrawalsAPI
      .list({ page })
      .then((res) => {
        setWithdrawals(res.data)
        setLastPage(res.pagination.lastPage)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, refreshKey])

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Withdrawal History</h3>
      </div>

      {withdrawals.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No withdrawal requests yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600">Amount</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Method</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Requested</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      ${w.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {METHOD_LABELS[w.payment_method] || w.payment_method}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[w.status].bg} ${STATUS_STYLES[w.status].text}`}
                      >
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(w.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {w.processed_at
                        ? new Date(w.processed_at).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {lastPage}
              </span>
              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

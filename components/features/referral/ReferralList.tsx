'use client'

import { useEffect, useState } from 'react'
import { referralAPI } from '@/lib/api/endpoints/referral'
import type { Referral } from '@/types/entities/referral'

const STATUS_STYLES: Record<Referral['status'], { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  active: { bg: 'bg-green-50', text: 'text-green-700' },
  credited: { bg: 'bg-blue-50', text: 'text-blue-700' },
}

export function ReferralList() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    referralAPI
      .list({ page })
      .then((res) => {
        setReferrals(res.data)
        setLastPage(res.pagination.lastPage)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

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
        <h3 className="text-lg font-semibold text-gray-900">Referred Users</h3>
      </div>

      {referrals.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No referrals yet. Share your referral link to get started.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Commission</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{r.referred_user_email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status].bg} ${STATUS_STYLES[r.status].text}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-900">${r.commission_amount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(r.created_at).toLocaleDateString()}
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

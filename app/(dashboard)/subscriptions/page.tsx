'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAdminSubscriptions } from '@/lib/hooks/queries/useAdminSubscriptions'
import { useDeletePendingSubscriptions } from '@/lib/hooks/mutations/useAdminSubscriptionMutations'
import type { AdminSubscription } from '@/lib/api/endpoints/admin-subscriptions'

function StatusBadge({ status }: { status?: string }) {
  const s = status?.toLowerCase() ?? ''
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-800',
    trialing: 'bg-blue-100 text-blue-800',
  }
  return (
    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${styles[s] ?? 'bg-gray-100 text-gray-700'}`}>
      {status ?? '—'}
    </span>
  )
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { data, isLoading } = useAdminSubscriptions({ page, keyword: keyword || undefined })
  const deletePendingMutation = useDeletePendingSubscriptions()

  const handleDeletePending = async () => {
    if (!confirm('Delete all pending subscriptions? This cannot be undone.')) return
    const result = await deletePendingMutation.mutateAsync()
    toast.success(`Deleted ${result?.deleted ?? 0} pending subscription(s).`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-2 text-sm text-gray-600">Manage user subscriptions</p>
        </div>
        <div className="mt-4 flex gap-3 sm:mt-0">
          <button
            onClick={handleDeletePending}
            disabled={deletePendingMutation.isPending}
            className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Delete Pending
          </button>
          <Link
            href="/subscriptions/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Create
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8 mb-6">
        <input
          type="search"
          placeholder="Search by user name, email, or plan…"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-md sm:text-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Plan</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expires At</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Started At</th>
                  <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.data.map((sub: AdminSubscription) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {sub.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Link
                        href={`/users/${sub.user_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {sub.user_name || '—'}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Link
                        href={`/users/${sub.user_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {sub.user_email || '—'}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                      {sub.subscription_plan_name || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <StatusBadge status={sub.statuses?.[0]?.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <Link href={`/subscriptions/${sub.id}`} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination && data.pagination.lastPage > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.pagination.lastPage}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.lastPage}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a subscription.</p>
          <Link href="/subscriptions/new" className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Create
          </Link>
        </div>
      )}
    </div>
  )
}

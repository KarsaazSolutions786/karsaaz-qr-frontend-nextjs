'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTransactions } from '@/lib/hooks/queries/useTransactions'
import { useApproveTransaction, useRejectTransaction } from '@/lib/hooks/mutations/useTransactionMutations'
import type { Transaction } from '@/types/entities/transaction'

function StatusBadge({ status }: { status?: string }) {
  const s = status?.toLowerCase() ?? ''
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${styles[s] ?? 'bg-gray-100 text-gray-700'}`}>
      {status ?? '—'}
    </span>
  )
}

function formatAmount(transaction: Transaction): string {
  if (transaction.formatted_amount) return transaction.formatted_amount
  if (transaction.amount != null) {
    const amt = transaction.amount > 100 ? transaction.amount / 100 : transaction.amount
    return `${transaction.currency ?? ''} ${amt.toFixed(2)}`.trim()
  }
  return '—'
}

function getUserDisplay(transaction: Transaction): string {
  return (
    transaction.user_name ||
    transaction.description ||
    (transaction.userId ? String(transaction.userId) : '') ||
    '—'
  )
}

function getDescriptionDisplay(transaction: Transaction): string {
  return (
    transaction.subscription_plan_name ||
    transaction.description ||
    '—'
  )
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useTransactions({ page, search: search || undefined })
  const approveMutation = useApproveTransaction()
  const rejectMutation = useRejectTransaction()

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this transaction?')) return
    await approveMutation.mutateAsync(Number(id))
    toast.success('Transaction approved successfully.')
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject this transaction?')) return
    await rejectMutation.mutateAsync(Number(id))
    toast.success('Transaction rejected successfully.')
  }

  const handleOpenProof = (transaction: Transaction) => {
    const proof = transaction.payment_proof
    if (proof) {
      window.open(proof, '_blank')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage payment transactions
          </p>
        </div>
      </div>

      <div className="mt-8 mb-6">
        <input
          type="search"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-md sm:text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 w-8">ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-32">Stripe ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="relative py-3.5 pl-3 pr-4 w-28"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.data.map((transaction: Transaction) => {
                  const isOffline = transaction.source === 'offline-payment'
                  const stripeId = transaction.stripe_payment_intent_id || transaction.stripePaymentIntentId
                  const date = transaction.createdAt || transaction.created_at

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {String(transaction.id).slice(0, 8)}
                        {String(transaction.id).length > 8 ? '…' : ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {formatAmount(transaction)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getUserDisplay(transaction)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-48 truncate">
                        {getDescriptionDisplay(transaction)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          isOffline ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {transaction.source || transaction.type?.replace('_', ' ') || '—'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs font-mono text-gray-400">
                        {stripeId ? (
                          <span title={stripeId}>{stripeId.slice(0, 12)}…</span>
                        ) : '---'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {date ? new Date(date).toLocaleDateString() : '—'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        {isOffline ? (
                          <div className="flex items-center justify-end gap-2">
                            {transaction.payment_proof && (
                              <button
                                onClick={() => handleOpenProof(transaction)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="View payment proof"
                              >
                                Proof
                              </button>
                            )}
                            <button
                              onClick={() => handleApprove(transaction.id)}
                              disabled={approveMutation.isPending}
                              className="text-green-600 hover:text-green-900 text-xs disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(transaction.id)}
                              disabled={rejectMutation.isPending}
                              className="text-red-600 hover:text-red-900 text-xs disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">---</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500">Transactions will appear here when payments are processed.</p>
        </div>
      )}
    </div>
  )
}

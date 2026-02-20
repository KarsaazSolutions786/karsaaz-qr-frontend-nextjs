'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUsers } from '@/lib/hooks/queries/useUsers'
import {
  useDeleteUser,
  useActAsUser,
  useResetUserRole,
  useResetUserScansLimit,
  useGenerateMagicUrl,
} from '@/lib/hooks/mutations/useUserMutations'
import { Filter, Plus, Copy, Check, X, Loader2 } from 'lucide-react'
import type { User } from '@/types/entities/user'

interface UserListContentProps {
  paying?: 'paying' | 'non-paying'
}

// ─── Magic URL Modal ──────────────────────────────────────────────────────────

function MagicUrlModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Magic Login URL</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          This URL is valid for <strong>24 hours</strong>. Share it with the user for one-time access.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50 select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Filter Modal ─────────────────────────────────────────────────────────────

function FilterModal({
  filters,
  onApply,
  onClose,
}: {
  filters: { minQRCodes: string; maxQRCodes: string }
  onApply: (f: { minQRCodes: string; maxQRCodes: string }) => void
  onClose: () => void
}) {
  const [min, setMin] = useState(filters.minQRCodes)
  const [max, setMax] = useState(filters.maxQRCodes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Users</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of QR Codes
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                min={0}
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                min={0}
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="No limit"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onApply({ minQRCodes: '', maxQRCodes: '' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={() => onApply({ minQRCodes: min, maxQRCodes: max })}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserListContent({ paying }: UserListContentProps) {
  const pathname = usePathname()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState({ minQRCodes: '', maxQRCodes: '' })
  const [magicUrl, setMagicUrl] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  // Build API params - match backend expectations
  const qrcodesFilter = (filters.minQRCodes || filters.maxQRCodes)
    ? JSON.stringify({
        ...(filters.minQRCodes ? { min: Number(filters.minQRCodes) } : {}),
        ...(filters.maxQRCodes ? { max: Number(filters.maxQRCodes) } : {}),
      })
    : undefined

  const { data, isLoading } = useUsers({
    page,
    search: search || undefined,
    paying,
    number_of_qrcodes: qrcodesFilter,
  })

  const deleteMutation = useDeleteUser()
  const actAsMutation = useActAsUser()
  const resetRoleMutation = useResetUserRole()
  const resetScansMutation = useResetUserScansLimit()
  const magicUrlMutation = useGenerateMagicUrl()

  const hasActiveFilters = !!(filters.minQRCodes || filters.maxQRCodes)

  const handleApplyFilters = useCallback((f: typeof filters) => {
    setFilters(f)
    setPage(1)
    setShowFilterModal(false)
  }, [])

  const handleDelete = async (user: User) => {
    if (
      confirm(
        `Delete "${user.name || user.email}"?\n\nThis will permanently delete all related QR Codes, subscriptions and transactions.`
      )
    ) {
      await deleteMutation.mutateAsync(Number(user.id))
    }
  }

  const handleActAs = async (user: User) => {
    if (confirm(`Impersonate "${user.name || user.email}"? You will be redirected to their dashboard.`)) {
      setPendingAction(`actas-${user.id}`)
      try {
        await actAsMutation.mutateAsync(Number(user.id))
      } finally {
        setPendingAction(null)
      }
    }
  }

  const handleResetRole = async (user: User) => {
    if (confirm(`Reset role for "${user.name || user.email}"? This will clear their assigned role.`)) {
      setPendingAction(`resetrole-${user.id}`)
      try {
        await resetRoleMutation.mutateAsync(Number(user.id))
      } finally {
        setPendingAction(null)
      }
    }
  }

  const handleResetScans = async (user: User) => {
    if (confirm(`Reset scan limits for "${user.name || user.email}"?`)) {
      setPendingAction(`resetscans-${user.id}`)
      try {
        await resetScansMutation.mutateAsync(Number(user.id))
      } finally {
        setPendingAction(null)
      }
    }
  }

  const handleMagicUrl = async (user: User) => {
    setPendingAction(`magic-${user.id}`)
    try {
      const result = await magicUrlMutation.mutateAsync(Number(user.id))
      setMagicUrl(result.url)
    } finally {
      setPendingAction(null)
    }
  }

  const tabs = [
    { label: 'All Users', href: '/users', active: pathname === '/users' },
    { label: 'Paying', href: '/users/paying', active: pathname === '/users/paying' },
    { label: 'Non-Paying', href: '/users/non-paying', active: pathname === '/users/non-paying' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-600">Manage all registered users</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/users/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="w-4 h-4" />
            Create User
          </Link>
        </div>
      </div>

      {/* Paying Filter Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                tab.active
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search + Filter */}
      <div className="mt-6 flex items-center gap-3">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:max-w-sm text-sm"
        />
        <button
          onClick={() => setShowFilterModal(true)}
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm ${
            hasActiveFilters
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-xs">
              1
            </span>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="inline-block h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Loading users...</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">ID</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">QRs</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Scans</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Main User</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    <th className="relative py-3.5 pl-3 pr-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {user.name || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.mobile_number || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                          {user.roles?.[0]?.name || user.role || '—'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.qrcodes_count ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.scans?.toLocaleString() ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.parent_user?.name || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {(user.created_at || user.createdAt)
                          ? new Date(user.created_at || user.createdAt!).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                          {/* Act As */}
                          <button
                            onClick={() => handleActAs(user)}
                            disabled={!!pendingAction}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            {pendingAction === `actas-${user.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : null}{' '}
                            Act As
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/users/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            Edit
                          </Link>

                          {/* Magic Login */}
                          <button
                            onClick={() => handleMagicUrl(user)}
                            disabled={!!pendingAction}
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            {pendingAction === `magic-${user.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : null}{' '}
                            Magic Link
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            Delete
                          </button>

                          {/* Reset Role */}
                          <button
                            onClick={() => handleResetRole(user)}
                            disabled={!!pendingAction}
                            className="text-orange-600 hover:text-orange-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            {pendingAction === `resetrole-${user.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : null}{' '}
                            Reset Role
                          </button>

                          {/* Reset Scans */}
                          <button
                            onClick={() => handleResetScans(user)}
                            disabled={!!pendingAction}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            {pendingAction === `resetscans-${user.id}` ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : null}{' '}
                            Reset Scans
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing page {page} of {data.pagination.lastPage} ({data.pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.lastPage}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try adjusting your search.' : 'No users match the current filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
      {magicUrl && (
        <MagicUrlModal url={magicUrl} onClose={() => setMagicUrl(null)} />
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'
import { useRoles } from '@/lib/hooks/queries/useRoles'
import { useDeleteRole } from '@/lib/hooks/mutations/useRoleMutations'
import type { RoleEntity } from '@/lib/api/endpoints/roles'

function RoleNameCell({ role }: { role: RoleEntity }) {
  const isSuperAdmin = role.name?.toLowerCase() === 'super admin'
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-medium text-gray-900">{role.name}</span>
      {role.read_only && (
        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
          Read Only
        </span>
      )}
      {isSuperAdmin && (
        <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
          Super Admin
        </span>
      )}
    </div>
  )
}

export default function RolesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useRoles({ page, search: search || undefined })
  const deleteMutation = useDeleteRole()

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the role "${name}"?`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Roles</h1>
          <p className="mt-2 text-sm text-gray-600">Manage roles and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/users/roles/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:max-w-md text-sm"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="inline-block h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide sm:pl-6">Name</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Home Page</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Permissions</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Users</th>
                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((role: RoleEntity) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <RoleNameCell role={role} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.home_page || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.permission_count ?? role.permission_ids?.length ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.user_count ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.created_at ? new Date(role.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/users/roles/${role.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id, role.name)}
                          disabled={role.read_only || deleteMutation.isPending}
                          title={role.read_only ? 'Read-only roles cannot be deleted' : undefined}
                          className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.pagination && data.pagination.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {page} of {data.pagination.lastPage} ({data.pagination.total} total)
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new role.</p>
            <div className="mt-6">
              <Link
                href="/users/roles/new"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <Plus className="w-4 h-4" />
                Create Role
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useCreateRole } from '@/lib/hooks/mutations/useRoleMutations'
import { PermissionsInput } from '@/components/features/roles/PermissionsInput'

export default function NewRolePage() {
  const [name, setName] = useState('')
  const [homePage, setHomePage] = useState('')
  const [permissionIds, setPermissionIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateRole()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Role name is required.')
      return
    }

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        home_page: homePage.trim() || undefined,
        permission_ids: permissionIds,
      })
      // useCreateRole redirects to /users/roles on success
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {}).flat().join(' ') ||
        'Failed to create role.'
      setError(msg as string)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/users/roles"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Roles
      </Link>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Create Role</h1>
          <p className="mt-1 text-sm text-gray-600">Define a new role and assign permissions.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Editor"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Home Page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Home Page
            </label>
            <input
              type="text"
              value={homePage}
              onChange={(e) => setHomePage(e.target.value)}
              placeholder="/dashboard/qrcodes"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              The page users with this role are redirected to after login.
            </p>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({permissionIds.length} selected)
              </span>
            </label>
            <PermissionsInput value={permissionIds} onChange={setPermissionIds} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
            <Link
              href="/users/roles"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

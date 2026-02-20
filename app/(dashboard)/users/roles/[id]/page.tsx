'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRole } from '@/lib/hooks/queries/useRoles'
import { useUpdateRole } from '@/lib/hooks/mutations/useRoleMutations'
import { PermissionsInput } from '@/components/features/roles/PermissionsInput'

export default function EditRolePage() {
  const params = useParams()
  const roleId = Number(params.id)

  const { data: role, isLoading } = useRole(roleId)
  const updateMutation = useUpdateRole()

  const [name, setName] = useState('')
  const [homePage, setHomePage] = useState('')
  const [permissionIds, setPermissionIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Pre-fill when role loads
  useEffect(() => {
    if (role) {
      setName(role.name)
      setHomePage(role.homePage || '')
      setPermissionIds(role.permissionIds || [])
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (!name.trim()) {
      setError('Role name is required.')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: roleId,
        data: {
          name: name.trim(),
          homePage: homePage.trim() || undefined,
          permissionIds,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {}).flat().join(' ') ||
        'Failed to save changes.'
      setError(msg as string)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-gray-600">Role not found.</p>
        <Link href="/users/roles" className="mt-4 inline-block text-blue-600 text-sm hover:underline">
          Back to roles
        </Link>
      </div>
    )
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
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Role</h1>
            <p className="mt-1 text-sm text-gray-500">ID: {role.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {role.readOnly && (
              <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                Read Only
              </span>
            )}
            {role.name?.toLowerCase() === 'super admin' && (
              <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800">
                Super Admin
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {saved && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Changes saved successfully.
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
              disabled={role.readOnly}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          {/* Home Page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Page</label>
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
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

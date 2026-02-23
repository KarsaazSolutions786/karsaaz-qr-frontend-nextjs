'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, XCircle, Loader2, UserPlus } from 'lucide-react'
import { useUser } from '@/lib/hooks/queries/useUsers'
import { useRoles } from '@/lib/hooks/queries/useRoles'
import { useUpdateUser, useVerifyUserEmail } from '@/lib/hooks/mutations/useUserMutations'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'
import { SubuserInviteModal } from '@/components/features/users/SubuserInviteModal'
import { SubuserPermissionsForm } from '@/components/features/users/SubuserPermissionsForm'

interface FormState {
  name: string
  email: string
  mobile_number: string
  password: string
  password_confirmation: string
  role_id: string
}

export default function EditUserPage() {
  const params = useParams()
  const userId = params.id as string

  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: rolesData } = useRoles()
  const updateMutation = useUpdateUser()
  const verifyEmailMutation = useVerifyUserEmail()

  // Sub-users (only for non-sub users that have sub accounts)
  const { data: subUsers } = useQuery({
    queryKey: [...queryKeys.users.detail(userId), 'sub-users'],
    queryFn: () => usersAPI.getSubUsers(Number(userId)),
    enabled: !!userId && !user?.is_sub,
  })

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    mobile_number: '',
    password: '',
    password_confirmation: '',
    role_id: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [subuserPermissions, setSubuserPermissions] = useState<string[]>([])

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        mobile_number: user.mobile_number || '',
        password: '',
        password_confirmation: '',
        role_id: user.roles?.[0]?.id ? String(user.roles[0].id) : '',
      })
    }
  }, [user])

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (form.password && form.password !== form.password_confirmation) {
      setError('Passwords do not match.')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: Number(userId),
        data: {
          name: form.name || undefined,
          email: form.email,
          mobile_number: form.mobile_number || undefined,
          password: form.password || undefined,
          password_confirmation: form.password_confirmation || undefined,
          role_id: form.role_id ? Number(form.role_id) : undefined,
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

  const handleVerifyEmail = async () => {
    if (confirm('Mark this user\'s email as verified?')) {
      await verifyEmailMutation.mutateAsync(Number(userId))
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-600">User not found.</p>
        <Link href="/users" className="mt-4 inline-block text-blue-600 text-sm hover:underline">
          Back to users
        </Link>
      </div>
    )
  }

  const isEmailVerified = !!user.email_verified_at || !!user.emailVerified

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back link */}
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* Main form */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit User</h1>
            <p className="mt-1 text-sm text-gray-500">ID: {user.id}</p>
          </div>
          {/* Email verification status */}
          <div className="flex items-center gap-2">
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="w-3 h-3" />
                Email Verified
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  <XCircle className="w-3 h-3" />
                  Unverified
                </span>
                <button
                  onClick={handleVerifyEmail}
                  disabled={verifyEmailMutation.isPending}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                >
                  {verifyEmailMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin inline" />
                  ) : null}{' '}
                  Verify
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="John Doe"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={form.mobile_number}
              onChange={set('mobile_number')}
              placeholder="+1 555 000 0000"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Leave empty to keep current password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password Confirmation */}
          {form.password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={set('password_confirmation')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Role — hidden for sub-users */}
          {user.is_sub ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <p className="text-sm text-gray-500 italic">Sub User — role is managed by the parent account.</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                value={form.role_id}
                onChange={set('role_id')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— Select a role —</option>
                {rolesData?.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
            <Link
              href="/users"
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

      {/* Sub-users section (only for non-sub users) */}
      {!user.is_sub && (
        <>
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Sub Users</h2>
              <p className="mt-0.5 text-sm text-gray-500">Users associated with this account.</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Invite Sub-User
            </button>
          </div>
          <div className="px-6 py-4">
            {!subUsers || (Array.isArray(subUsers) && subUsers.length === 0) ? (
              <p className="text-sm text-gray-500 italic">No sub users found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {(Array.isArray(subUsers) ? subUsers : (subUsers as any)?.data || []).map((sub: any) => (
                  <li key={sub.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.name || sub.email}</p>
                      <p className="text-xs text-gray-500">{sub.email}</p>
                    </div>
                    <Link
                      href={`/users/${sub.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Sub-User Permissions</h2>
            <p className="mt-0.5 text-sm text-gray-500">Configure default permissions for sub-users.</p>
          </div>
          <div className="px-6 py-4">
            <SubuserPermissionsForm
              userId={userId}
              permissions={subuserPermissions}
              onChange={setSubuserPermissions}
            />
          </div>
        </div>

        {/* Invite Modal */}
        <SubuserInviteModal
          parentUserId={userId}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      </>
      )}
    </div>
  )
}

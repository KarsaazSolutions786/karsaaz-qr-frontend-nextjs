'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, XCircle, Loader2, UserPlus, ShieldCheck } from 'lucide-react'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useUser } from '@/lib/hooks/queries/useUsers'
import { useRoles } from '@/lib/hooks/queries/useRoles'
import { useUpdateUser, useVerifyUserEmail } from '@/lib/hooks/mutations/useUserMutations'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'
import { SubuserInviteModal } from '@/components/features/users/SubuserInviteModal'
import { AdminSetUserPasswordModal } from '@/components/features/users/AdminSetUserPasswordModal'
import { SubuserPermissionsForm } from '@/components/features/users/SubuserPermissionsForm'
import { usePasswordlessStatus } from '@/lib/hooks/mutations/usePasswordlessAuth'
import { useTranslation } from '@/lib/i18n'
import { useConfirmation } from '@/components/ui/confirmation-modal'

interface FormState {
  name: string
  email: string
  mobile_number: string
  password: string
  password_confirmation: string
  role_id: string
}

/**
 * Purpose: Executes EditUserPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditUserPage() {
  const { confirm } = useConfirmation()
  const { t } = useTranslation()
  const params = useParams()
  const userId = params.id as string

  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: rolesData } = useRoles()
  const updateMutation = useUpdateUser()
  const verifyEmailMutation = useVerifyUserEmail()

  // Global passwordless feature flag
  const { data: passwordlessStatus } = usePasswordlessStatus()
  const isPasswordlessGloballyEnabled = !!passwordlessStatus?.enabled

  // Per-user passwordless preference mutation
  const [passwordlessPref, setPasswordlessPref] = useState<'enabled' | 'disabled' | null>(null)
  const [passwordlessSaving, setPasswordlessSaving] = useState(false)
  const [passwordlessError, setPasswordlessError] = useState<string | null>(null)
  const [passwordlessSaved, setPasswordlessSaved] = useState(false)
  const [showAdminSetPasswordModal, setShowAdminSetPasswordModal] = useState(false)

  const setPasswordlessPrefMutation = useMutation({
    mutationFn: ({
      pref,
      password,
      password_confirmation,
    }: {
      pref: 'enabled' | 'disabled'
      password?: string
      password_confirmation?: string
    }) => usersAPI.setPasswordlessPreference(Number(userId), pref, password, password_confirmation),
  })

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
      // Seed passwordless preference: null password means passwordless user
      const meta = (user as any).meta
      const metaPref = meta?.passwordless_login_preference
      if (metaPref === 'enabled' || metaPref === 'disabled') {
        setPasswordlessPref(metaPref)
      } else {
        // Infer from password: null = passwordless, non-null = traditional
        setPasswordlessPref((user as any).password === null ? 'enabled' : 'disabled')
      }
    }
  }, [user])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
        Object.values(err?.response?.data?.errors || {})
          .flat()
          .join(' ') ||
        'Failed to save changes.'
      setError(msg as string)
    }
  }

  /**
   * Purpose: Executes handleVerifyEmail functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleVerifyEmail = async () => {
    if (
      await confirm({
        title: 'Are you sure?',
        message: "Mark this user's email as verified?",
        type: 'danger',
      })
    ) {
      await verifyEmailMutation.mutateAsync(Number(userId))
    }
  }

  /**
   * Purpose: Executes handlePasswordlessToggle functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handlePasswordlessToggle = async () => {
    const newPref = passwordlessPref === 'enabled' ? 'disabled' : 'enabled'

    if (newPref === 'disabled') {
      setShowAdminSetPasswordModal(true)
      return
    }

    setPasswordlessError(null)
    setPasswordlessSaving(true)
    try {
      const result = await setPasswordlessPrefMutation.mutateAsync({ pref: newPref })
      if (result.success) {
        setPasswordlessPref(newPref)
        setPasswordlessSaved(true)
        setTimeout(() => setPasswordlessSaved(false), 3000)
      }
    } catch (err: any) {
      setPasswordlessError(
        err?.response?.data?.message || 'Failed to update passwordless preference.'
      )
    } finally {
      setPasswordlessSaving(false)
    }
  }

  const handleAdminSetPasswordSuccess = () => {
    setShowAdminSetPasswordModal(false)
    setPasswordlessPref('disabled')
    setPasswordlessSaved(true)
    setTimeout(() => setPasswordlessSaved(false), 3000)
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-600">{t('User not found.')}</p>
        <Link href="/users" className="mt-4 inline-block text-blue-600 text-sm hover:underline">
          {t('Back to users')}
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
        {t('Back to Users')}
      </Link>

      {/* Main form */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{t('Edit User')}</h1>
            <p className="mt-1 text-sm text-gray-500">ID: {user.id}</p>
          </div>
          {/* Email verification status */}
          <div className="flex items-center gap-2">
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="w-3 h-3" />
                {t('Email Verified')}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  <XCircle className="w-3 h-3" />
                  {t('Unverified')}
                </span>
                <button
                  onClick={handleVerifyEmail}
                  disabled={verifyEmailMutation.isPending}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                >
                  {verifyEmailMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin inline" />
                  ) : null}{' '}
                  {t('Verify')}
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
              {t('Changes saved successfully.')}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('Full Name')}
            </label>
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
              {t('Email Address')} <span className="text-red-500">*</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('Mobile Number')}
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('New Password')}
            </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('Confirm New Password')}
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Role')}</label>
              <p className="text-sm text-gray-500 italic">
                {t('Sub User — role is managed by the parent account.')}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Role')}</label>
              <select
                value={form.role_id}
                onChange={set('role_id')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— Select a role —</option>
                {rolesData?.data?.map(role => (
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
              {t('Cancel')}
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('Save Changes')}
            </button>
          </div>
        </form>
      </div>

      {/* Storage Usage */}
      <StorageSection userId={userId} />

      {/* Passwordless Login — only shown when feature is globally enabled */}
      {isPasswordlessGloballyEnabled && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">{t('Login Method')}</h2>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {t('Control whether this user signs in with a one-time email code or a password.')}
            </p>
          </div>
          <div className="px-6 py-5">
            {passwordlessSaved && (
              <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                {t('Login preference updated.')}
              </div>
            )}
            {passwordlessError && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {passwordlessError}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {passwordlessPref === 'enabled'
                    ? t('Passwordless (Email OTP)')
                    : t('Password Login')}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {passwordlessPref === 'enabled'
                    ? t('User receives a 6-digit code by email to log in — no password needed.')
                    : t('User logs in with their email and password.')}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePasswordlessToggle}
                disabled={passwordlessSaving || passwordlessPref === null}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                  passwordlessPref === 'enabled' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={passwordlessPref === 'enabled'}
              >
                {passwordlessSaving ? (
                  <span className="pointer-events-none inline-block h-5 w-5 flex items-center justify-center">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                  </span>
                ) : (
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      passwordlessPref === 'enabled' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordlessGloballyEnabled && (
        <AdminSetUserPasswordModal
          open={showAdminSetPasswordModal}
          userId={Number(userId)}
          onClose={() => setShowAdminSetPasswordModal(false)}
          onSuccess={handleAdminSetPasswordSuccess}
        />
      )}

      {/* Sub-users section (only for non-sub users) */}
      {!user.is_sub && (
        <>
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{t('Sub Users')}</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {t('Users associated with this account.')}
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t('Invite Sub-User')}
              </button>
            </div>
            <div className="px-6 py-4">
              {!subUsers || (Array.isArray(subUsers) && subUsers.length === 0) ? (
                <p className="text-sm text-gray-500 italic">{t('No sub users found.')}</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {(Array.isArray(subUsers) ? subUsers : (subUsers as any)?.data || []).map(
                    (sub: any) => (
                      <li key={sub.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {sub.name || sub.email}
                          </p>
                          <p className="text-xs text-gray-500">{sub.email}</p>
                        </div>
                        <Link
                          href={`/users/${sub.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {t('Edit')}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">{t('Sub-User Permissions')}</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {t('Configure default permissions for sub-users.')}
              </p>
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

/**
 * Purpose: Executes StorageSection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function StorageSection({ userId }: { userId: string }) {
  const { t } = useTranslation()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'user-storage', userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users/${userId}/storage`,
        {
          credentials: 'include',
        }
      )
      if (!res.ok) return null
      return (await res.json()).data
    },
    enabled: !!userId,
  })

  const [isRecalculating, setIsRecalculating] = useState(false)

  /**
   * Purpose: Executes handleRecalculate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleRecalculate = async () => {
    setIsRecalculating(true)
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users/${userId}/storage/recalculate`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      refetch()
    } finally {
      setIsRecalculating(false)
    }
  }

  if (isLoading) return null
  if (!data) return null

  const barColor =
    data.percentage >= 95 ? 'bg-red-500' : data.percentage >= 80 ? 'bg-yellow-500' : 'bg-blue-500'

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">{t('Storage Usage')}</h2>
      </div>
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {data.used_formatted} / {data.quota_formatted}
          </span>
          <span className="text-gray-500">{Math.round(data.percentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(data.percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {data.files_count ?? 0} {t('files')}
          </span>
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {isRecalculating ? t('Recalculating...') : t('Recalculate')}
          </button>
        </div>
      </div>
    </div>
  )
}

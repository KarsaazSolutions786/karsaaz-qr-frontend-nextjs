'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { ProfileEditor } from '@/components/features/auth/ProfileEditor'
import { SubUserManagement } from '@/components/features/account/SubUserManagement'
import { LoginPreferenceToggle } from '@/components/features/auth/LoginPreferenceToggle'
import { DeleteAccountDialog } from '@/components/features/auth/DeleteAccountDialog'

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Please sign in to view this page</div>
      </div>
    )
  }

  // Sub-users visible for non-sub-users only (main account holders)
  const showSubUsers = !user.is_sub

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card — read-only overview */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
              {user.roles?.[0]?.name && (
                <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {user.roles[0].name}
                </span>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              {user.email_verified_at ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-yellow-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile — form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Profile</h2>
          <ProfileEditor user={user} />
        </div>

        {/* Login Preference Toggle — only visible when passwordless is enabled */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Login Preferences</h2>
          <LoginPreferenceToggle />
        </div>

        {/* Sub-User Management */}
        {showSubUsers && (
          <SubUserManagement userId={Number(user.id)} />
        )}

        {/* Danger Zone — Delete Account */}
        <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-600">Danger Zone</h2>
          <p className="mb-4 text-sm text-gray-600">
            Once you delete your account, there is no going back. All your data will be
            permanently removed.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </button>
        </div>
      </div>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

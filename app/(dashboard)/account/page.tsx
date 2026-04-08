'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRpcComposite } from '@/lib/hooks/useRpc'
import { ProfileCard } from '@/components/features/account/ProfileCard'
import { SubscriptionCard } from '@/components/features/account/SubscriptionCard'
import { BillingManagementCard } from '@/components/features/account/BillingManagementCard'
import { EditProfileModal } from '@/components/features/account/EditProfileModal'
import { ResetPasswordModal } from '@/components/features/account/ResetPasswordModal'
import { SubUserManagement } from '@/components/features/account/SubUserManagement'
import { TwoFactorTab } from '@/components/features/account/TwoFactorTab'
import { LoginPreferenceToggle } from '@/components/features/auth/LoginPreferenceToggle'
import { DeleteAccountDialog } from '@/components/features/auth/DeleteAccountDialog'
import { queryKeys } from '@/lib/query/keys'
import type { User } from '@/types/entities/user'

export default function AccountPage() {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const queryClient = useQueryClient()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Pre-fetch user + subscription + usage in a single RPC call to avoid waterfalling.
  // useSubscription (in SubscriptionCard) will hit the pre-seeded cache instead of fetching.
  const { data: profileData } = useRpcComposite<{
    user: User
    subscription: { subscription: Record<string, unknown> | null; plan: Record<string, unknown> | null }
    usage: Record<string, unknown>
  }>('profile', {}, { enabled: !!user, staleTime: 2 * 60 * 1000 })

  // Seed the subscription cache so useSubscription doesn't make a redundant request
  useEffect(() => {
    if (profileData?.subscription != null) {
      queryClient.setQueryData(queryKeys.subscriptions.current(), profileData.subscription.subscription ?? null)
    }
  }, [profileData, queryClient])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">{t('Loading...')}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">{t('Please sign in to view this page')}</div>
      </div>
    )
  }

  const showSubUsers = !user.is_sub

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('My Account')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Manage your profile and subscription')}</p>
        </div>

        {/* Profile Card */}
        <ProfileCard
          user={user}
          onEditProfile={() => setShowEditProfile(true)}
          onResetPassword={() => setShowResetPassword(true)}
        />

        {/* Subscription Details */}
        <SubscriptionCard user={user} />

        {/* Stripe Billing Management */}
        <BillingManagementCard />

        {/* Login Preferences */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('Login Preferences')}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t('Choose how you want to sign in to your account.')}
          </p>
          <LoginPreferenceToggle />
        </div>

        {/* Two-Factor Authentication */}
        <TwoFactorTab userId={Number(user.id)} />

        {/* Sub-User Management */}
        {showSubUsers && <SubUserManagement userId={Number(user.id)} />}

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-600">{t('Danger Zone')}</h2>
          <p className="mb-4 text-sm text-gray-600">
            {t('All of your QR codes will be deleted immediately, you will have no longer access to the platform.')}
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            {t('Delete Account')}
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal open={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <ResetPasswordModal open={showResetPassword} onClose={() => setShowResetPassword(false)} />
      <DeleteAccountDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </div>
  )
}

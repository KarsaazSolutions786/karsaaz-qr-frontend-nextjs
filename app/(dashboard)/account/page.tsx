'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { SubUserManagement } from '@/components/features/account/SubUserManagement'
import { LoginPreferenceToggle } from '@/components/features/auth/LoginPreferenceToggle'
import { DeleteAccountDialog } from '@/components/features/auth/DeleteAccountDialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProfileTab } from '@/components/features/account/ProfileTab'
import { ApiTokensTab } from '@/components/features/account/ApiTokensTab'
import { TwoFactorTab } from '@/components/features/account/TwoFactorTab'
import { NotificationsTab } from '@/components/features/account/NotificationsTab'
import { ActivityLogTab } from '@/components/features/account/ActivityLogTab'
import { SessionsTab } from '@/components/features/account/SessionsTab'

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
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

  const showSubUsers = !user.is_sub

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap gap-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api-tokens">API Tokens</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <ProfileTab user={user} />

              {/* Login Preference Toggle */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Login Preferences</h2>
                <LoginPreferenceToggle />
              </div>

              {/* Sub-User Management */}
              {showSubUsers && (
                <SubUserManagement userId={Number(user.id)} />
              )}

              {/* Danger Zone */}
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
          </TabsContent>

          <TabsContent value="api-tokens">
            <ApiTokensTab userId={user.id} />
          </TabsContent>

          <TabsContent value="2fa">
            <TwoFactorTab userId={user.id} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab userId={user.id} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogTab userId={user.id} />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsTab userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

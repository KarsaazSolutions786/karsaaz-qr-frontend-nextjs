'use client'

import { useState } from 'react'
import {
  usePasswordlessStatus,
  usePasswordlessGetPreference,
  usePasswordlessSetPreference,
} from '@/lib/hooks/mutations/usePasswordlessAuth'
import { CreatePasswordModal } from './CreatePasswordModal'

/**
 * LoginPreferenceToggle — allows authenticated users to switch between
 * passwordless (email+OTP) and traditional (email+password) login.
 *
 * Matches original legacy behaviour from qrcg-my-account.js:
 *   - Shows toggle only when passwordless feature is enabled globally
 *   - Switching to traditional opens CreatePasswordModal (set a password)
 *   - Switching to passwordless sends PUT with preference='enabled'
 */
export function LoginPreferenceToggle() {
  const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false)

  // 1. Check if passwordless is globally enabled
  const { data: statusData, isLoading: statusLoading } = usePasswordlessStatus()

  // 2. Get user's current preference
  const {
    data: prefData,
    isLoading: prefLoading,
    refetch: refetchPreference,
  } = usePasswordlessGetPreference()

  // 3. Mutation to update preference
  const setPreferenceMutation = usePasswordlessSetPreference()

  // Don't render if passwordless is not enabled globally
  if (statusLoading || prefLoading) {
    return (
      <div className="animate-pulse h-12 bg-gray-100 rounded-md" />
    )
  }

  if (!statusData?.enabled) {
    return null
  }

  const isPasswordless = prefData?.preference === 'passwordless'

  const handleToggle = () => {
    if (isPasswordless) {
      // Switching FROM passwordless TO traditional — need to set a password
      setShowCreatePasswordModal(true)
    } else {
      // Switching FROM traditional TO passwordless — just enable it
      setPreferenceMutation.mutate(
        { preference: 'enabled' },
        {
          onSuccess: () => {
            refetchPreference()
          },
        }
      )
    }
  }

  const handleCreatePasswordSuccess = () => {
    setShowCreatePasswordModal(false)
    refetchPreference()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Login Method</h4>
          <p className="text-sm text-gray-500">
            {isPasswordless
              ? 'You sign in with a one-time code sent to your email.'
              : 'You sign in with your email and password.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={setPreferenceMutation.isPending}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
            isPasswordless ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={isPasswordless}
          aria-label="Toggle passwordless login"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isPasswordless ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPasswordless
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isPasswordless ? '🔐 Passwordless (Email OTP)' : '🔑 Password Login'}
        </span>
        {setPreferenceMutation.isPending && (
          <span className="text-xs text-gray-500">Updating…</span>
        )}
      </div>

      {setPreferenceMutation.isError && (
        <p className="mt-2 text-sm text-red-600">
          {(setPreferenceMutation.error as any)?.response?.data?.message ||
            'Failed to update login preference. Please try again.'}
        </p>
      )}

      <CreatePasswordModal
        open={showCreatePasswordModal}
        onClose={() => setShowCreatePasswordModal(false)}
        onSuccess={handleCreatePasswordSuccess}
      />
    </>
  )
}

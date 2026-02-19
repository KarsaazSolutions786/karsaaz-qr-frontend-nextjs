'use client'

/**
 * SignupPageContent — handles the signup/registration page logic.
 *
 * Matches original qrcg-account-router.js behaviour:
 *   - When passwordless auth is ENABLED → redirect to /login
 *     (because the Email+OTP flow handles both login and registration)
 *   - When passwordless auth is DISABLED → show normal signup form
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePasswordlessStatus } from '@/lib/hooks/mutations/usePasswordlessAuth'
import { RegisterForm } from './RegisterForm'
import { GoogleLoginButton } from './GoogleLoginButton'

export function SignupPageContent() {
  const router = useRouter()
  const { data: statusData, isLoading, isError } = usePasswordlessStatus()

  // Redirect to login when passwordless is enabled
  // (matches original: <qrcg-redirect from="/account/sign-up" to="/account/login">)
  useEffect(() => {
    if (!isLoading && !isError && statusData?.enabled === true) {
      router.replace('/login')
    }
  }, [isLoading, isError, statusData, router])

  // While checking status, show spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  // If passwordless is enabled, show nothing while redirecting
  if (!isError && statusData?.enabled === true) {
    return null
  }

  // ── Passwordless DISABLED: show normal signup form ──
  // Matches original qrcg-sign-up.js layout
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-purple-600">Karsaaz</span>{' '}
          <span className="text-gray-700">QR</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign Up to your account and join us.
        </p>
      </div>

      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <RegisterForm />
    </div>
  )
}

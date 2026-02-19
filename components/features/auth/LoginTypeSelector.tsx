'use client'

/**
 * LoginTypeSelector — exact React replica of original login-type-selector.js
 *
 * On mount, fetches GET /api/passwordless-auth/status to check if passwordless
 * auth is enabled. Based on the result (and optional query params), renders:
 *
 *   - EmailOtpLoginForm   (if passwordless is enabled)
 *   - LoginForm           (default / traditional email+password)
 *
 * Query param overrides (matches original):
 *   ?dev=true         → force traditional login
 *   ?traditional=true → force traditional login
 */

import { useSearchParams } from 'next/navigation'
import { usePasswordlessStatus } from '@/lib/hooks/mutations/usePasswordlessAuth'
import { EmailOtpLoginForm } from './EmailOtpLoginForm'
import { LoginForm } from './LoginForm'
import { GoogleLoginButton } from './GoogleLoginButton'

export function LoginTypeSelector() {
  const searchParams = useSearchParams()
  const { data: statusData, isLoading, isError } = usePasswordlessStatus()

  // ── Loading state (matches original: returns '' while loading) ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  // ── Query param overrides (matches original exactly) ──
  const forceDev = searchParams.get('dev') === 'true'
  const forceTraditional = searchParams.get('traditional') === 'true'

  if (forceDev || forceTraditional) {
    return <TraditionalLoginView />
  }

  // ── Passwordless enabled → show Email + OTP form ──
  if (!isError && statusData?.enabled === true) {
    return <EmailOtpLoginForm />
  }

  // ── Default: Traditional email + password login ──
  return <TraditionalLoginView />
}

/**
 * Traditional login view — matches the existing login page layout
 * with Google button + divider + LoginForm.
 */
function TraditionalLoginView() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-purple-600">Karsaaz</span>{' '}
          <span className="text-gray-700">QR</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account and join us.
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

      <LoginForm />
    </div>
  )
}

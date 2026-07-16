'use client'

/**
 * SignupPageContent — handles the signup/registration page logic.
 *
 * Matches original qrcg-account-router.js behaviour:
 *   - When passwordless auth is ENABLED → redirect to /login
 *     (because the Email+OTP flow handles both login and registration)
 *   - When passwordless auth is DISABLED → show normal signup form
 *   - When new user registration is DISABLED → show disabled message
 */

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePasswordlessStatus } from '@/lib/hooks/mutations/usePasswordlessAuth'
import { useTranslation } from '@/lib/i18n'
import { RegisterForm } from './RegisterForm'
import { OrgRegisterForm } from './OrgRegisterForm'
import { GoogleLoginButton } from './GoogleLoginButton'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes SignupPageContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function SignupPageContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOrgIntent = searchParams?.get('intent') === 'organization'
  const { data: statusData, isLoading, isError } = usePasswordlessStatus()
  const [registrationDisabled, setRegistrationDisabled] = useState(false)

  // Redirect to login when passwordless is enabled
  // (matches original: <qrcg-redirect from="/account/sign-up" to="/account/login">)
  // Skipped for the org-signup intent -- the combined account+organization flow
  // needs a real password (OrgRegisterForm), passwordless/OTP login has no
  // equivalent combined step.
  useEffect(() => {
    if (!isOrgIntent && !isLoading && !isError && statusData?.enabled === true) {
      router.replace('/login')
    }
  }, [isOrgIntent, isLoading, isError, statusData, router])

  // While checking status, show spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LottieLoader size={80} />
      </div>
    )
  }

  // If passwordless is enabled, show nothing while redirecting (not for org intent)
  if (!isOrgIntent && !isError && statusData?.enabled === true) {
    return null
  }

  // ── Passwordless DISABLED: show normal signup form ──
  // Matches original qrcg-sign-up.js layout

  // If registration is disabled, show message instead of form
  if (registrationDisabled) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Registration Disabled')}</h2>
          <p className="mt-4 text-sm text-gray-600">
            {t(
              'New user registrations are currently disabled. Please contact the administrator for more information.'
            )}
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {t('Go to Login')}
        </Link>
      </div>
    )
  }

  if (isOrgIntent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('Create your')} <span className="text-purple-600">Karsaaz</span>{' '}
            <span className="text-gray-700">QR</span> {t('organization')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('One step: your account and your organization, both set up together.')}
          </p>
        </div>

        <OrgRegisterForm onRegistrationDisabled={() => setRegistrationDisabled(true)} />

        <p className="text-center text-sm text-gray-500">
          {t('Already manage an organization?')}{' '}
          <Link
            href="/org-portal/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            {t('Sign in to the Organization Portal')}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('Welcome to')} <span className="text-purple-600">Karsaaz</span>{' '}
          <span className="text-gray-700">QR</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t('Sign Up to your account and join us.')}</p>
      </div>

      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">{t('Or continue with email')}</span>
        </div>
      </div>

      <RegisterForm onRegistrationDisabled={() => setRegistrationDisabled(true)} />
    </div>
  )
}

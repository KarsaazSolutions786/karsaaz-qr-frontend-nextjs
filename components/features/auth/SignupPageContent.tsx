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
import { LottieLoader } from '@/components/ui/lottie-loader'
import Image from 'next/image'

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
      <div
        className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)] text-white text-center space-y-6"
        style={{ minHeight: 543, padding: '40px 24px 30px' }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white">{t('Registration Disabled')}</h2>
          <p className="mt-4 text-sm text-white/90">
            {t(
              'New user registrations are currently disabled. Please contact the administrator for more information.'
            )}
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block rounded-full bg-[#8351e0] px-6 py-2.5 text-white hover:bg-[#7244c8] font-semibold text-center transition-colors"
        >
          {t('Go to Login')}
        </Link>
      </div>
    )
  }

  if (isOrgIntent) {
    return (
      <div
        className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)] text-white space-y-6"
        style={{ minHeight: 543, padding: '40px 24px 30px' }}
      >
        <div className="text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-x-2">
              <h2
                className="whitespace-nowrap text-[24px] font-semibold leading-normal text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t('Create your')}
              </h2>
              <Image
                src="/images/auth/karsaaz-logo.svg"
                alt="Karsaaz QR"
                width={150}
                height={31.4}
                priority
              />
            </div>
            <h3 className="mt-1 text-[20px] font-semibold text-white">{t('organization')}</h3>
          </div>
          <p className="mt-3 text-xs text-white/90">
            {t('One step: your account and your organization, both set up together.')}
          </p>
        </div>

        <OrgRegisterForm onRegistrationDisabled={() => setRegistrationDisabled(true)} />

        <p className="text-center text-xs text-white/90">
          {t('Already manage an organization?')}{' '}
          <Link
            href="/login"
            className="font-semibold text-white underline decoration-solid hover:text-white/80"
          >
            {t('Sign in')}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)] text-white space-y-6"
      style={{ minHeight: 543, padding: '40px 24px 30px' }}
    >
      <div className="text-center">
        {/* "Welcome to" + Karsaaz QR logo inline */}
        <div className="flex items-center gap-x-2 justify-center">
          <h2
            className="whitespace-nowrap text-[28px] font-semibold leading-normal text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t('Welcome to')}
          </h2>
          <Image
            src="/images/auth/karsaaz-logo.svg"
            alt="Karsaaz QR"
            width={176.5}
            height={36.9}
            priority
          />
        </div>
        <p className="mt-2 text-sm text-white/90">{t('Sign Up to your account and join us.')}</p>
      </div>

      <div className="flex justify-center">
        <GoogleLoginButton />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-white/80">{t('Or continue with email')}</span>
        </div>
      </div>

      <RegisterForm onRegistrationDisabled={() => setRegistrationDisabled(true)} />
    </div>
  )
}

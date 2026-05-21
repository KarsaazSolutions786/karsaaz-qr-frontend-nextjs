'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { OTPVerificationForm } from '@/components/features/auth/OTPVerificationForm'
import Link from 'next/link'

/**
 * Purpose: Executes VerifyEmailContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  
  // Get email from URL params, or fall back to logged-in user's email
  const email = searchParams.get('email') || user?.email || ''

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {t('Email Verification Required')}
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              {t('Please register or login first to verify your email.')}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {t('Login')}
            </Link>
            <Link
              href="/signup"
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              {t('Sign Up')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('Verify your email')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('Enter the verification code we sent to your email')}
          </p>
        </div>

        <div className="mt-8">
          <OTPVerificationForm email={email} />
        </div>
      </div>
    </div>
  )
}

/**
 * Purpose: Executes VerifyEmailPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function VerifyEmailPage() {
  const { t } = useTranslation()

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">{t('Loading...')}</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

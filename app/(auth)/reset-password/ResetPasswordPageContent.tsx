'use client'

import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes ResetPasswordPageContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function ResetPasswordPageContent({ token, email }: { token: string; email: string }) {
  const { t } = useTranslation()

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('Invalid Reset Link')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('This password reset link is invalid or has expired.')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('Reset your password')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('Enter your new password below. Reset links expire after 60 minutes.')}
          </p>
        </div>

        <div className="mt-8">
          <ResetPasswordForm token={token} email={email} />
        </div>
      </div>
    </div>
  )
}

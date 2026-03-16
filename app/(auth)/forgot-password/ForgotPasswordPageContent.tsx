'use client'

import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm'
import { useTranslation } from '@/lib/i18n'

export function ForgotPasswordPageContent() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('Forgot your password?')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("No worries, we'll send you reset instructions")}
          </p>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

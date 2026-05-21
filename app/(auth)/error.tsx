'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes AuthError functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error('[Auth Error]', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">{t('Authentication Error')}</h1>

        <p className="text-gray-600 mb-6">
          {error.message || t('Something went wrong during authentication. Please try again.')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('Try Again')}
          </button>

          <Link
            href="/login"
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('Back to Login')}
          </Link>
        </div>
      </div>
    </div>
  )
}

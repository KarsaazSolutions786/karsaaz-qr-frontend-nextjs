'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes PublicError functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error('[Public Page Error]', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Page Unavailable')}</h1>

        <p className="text-gray-600 mb-6">
          {error.message ||
            t('This page could not be loaded. It may have been removed or the link may be incorrect.')}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('Reload')}
          </button>

          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('Home')}
          </Link>
        </div>
      </div>
    </div>
  )
}

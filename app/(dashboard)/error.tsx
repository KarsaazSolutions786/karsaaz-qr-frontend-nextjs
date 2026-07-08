'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes DashboardError functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Something went wrong')}</h1>

        <p className="text-gray-600 mb-6">
          {error.message || t('An unexpected error occurred while loading this page.')}
        </p>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">Digest: {error.digest}</p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] text-white rounded-lg hover:brightness-105 transition-all shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('Try Again')}
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Go Back')}
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('Dashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}

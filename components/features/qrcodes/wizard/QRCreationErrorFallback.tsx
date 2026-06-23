'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface QRCreationErrorFallbackProps {
  onRetry?: () => void
}

export function QRCreationErrorFallback({ onRetry }: QRCreationErrorFallbackProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t('Something went wrong')}</h2>
      <p className="mt-2 text-sm text-gray-600">
        {t(
          'The QR code editor encountered an unexpected error. Your progress may be saved — try reloading this step.'
        )}
      </p>
      <button
        type="button"
        onClick={() => (onRetry ? onRetry() : window.location.reload())}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
      >
        <RefreshCw className="h-4 w-4" />
        {t('Try again')}
      </button>
    </div>
  )
}

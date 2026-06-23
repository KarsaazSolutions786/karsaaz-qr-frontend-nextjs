'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getErrorMessage } from '@/lib/api/errors'

interface PageQueryErrorProps {
  error: unknown
  title?: string
  onRetry?: () => void
  className?: string
}

/**
 * Inline error banner for dashboard pages when a react-query fetch fails.
 */
export function PageQueryError({ error, title, onRetry, className = '' }: PageQueryErrorProps) {
  const { t } = useTranslation()
  const message = getErrorMessage(error)

  return (
    <div className={`rounded-xl border border-red-200 bg-red-50 p-6 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden />
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-red-900">
            {title ?? t('Failed to load data')}
          </h2>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4" />
              {t('Try again')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

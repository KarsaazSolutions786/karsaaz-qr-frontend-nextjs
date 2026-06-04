'use client'

import React, { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface WizardNavigationProps {
  onBack?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  isLastStep?: boolean
  isSubmitting?: boolean
  isValidating?: boolean
  backLabel?: string
  nextLabel?: string
  submitLabel?: string
  className?: string
  enableKeyboardShortcuts?: boolean
}

/**
 * Purpose: Executes WizardNavigation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function WizardNavigation({
  onBack,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  isSubmitting = false,
  isValidating = false,
  backLabel,
  nextLabel,
  submitLabel,
  className,
  enableKeyboardShortcuts = true,
}: WizardNavigationProps) {
  const { t } = useTranslation()
  const resolvedBackLabel = backLabel || t('Back')
  const resolvedNextLabel = nextLabel || t('Next')
  const resolvedSubmitLabel = submitLabel || t('Submit')
  const isLoading = isSubmitting || isValidating

  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    /**
     * Purpose: Executes handleKeyDown functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault()
        if (isLastStep && onSubmit) {
          onSubmit()
        } else if (canGoNext && onNext) {
          onNext()
        }
      }

      if (e.key === 'Escape' && canGoBack && onBack && !isLoading) {
        e.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    canGoBack,
    canGoNext,
    isLastStep,
    isLoading,
    onBack,
    onNext,
    onSubmit,
    enableKeyboardShortcuts,
  ])

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack || isLoading}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          canGoBack && !isLoading
            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed',
          !canGoBack && 'invisible'
        )}
        aria-label={t('Go to previous step')}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {resolvedBackLabel}
      </button>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          // Submit must NOT depend on canGoNext: on the last step canGoNext is
          // always false (there is no next step), which previously left Submit
          // permanently disabled. Only block while a save/submit is in flight.
          disabled={isLoading}
          title={isLoading ? t('Submitting...') : undefined}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          )}
          aria-label={t('Submit form')}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('Submitting...')}
            </>
          ) : (
            resolvedSubmitLabel
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isLoading || !canGoNext}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            !isLoading && canGoNext
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          )}
          aria-label={t('Go to next step')}
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('Validating...')}
            </>
          ) : (
            <>
              {resolvedNextLabel}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

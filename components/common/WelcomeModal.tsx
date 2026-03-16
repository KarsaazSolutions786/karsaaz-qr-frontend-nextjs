'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { X } from 'lucide-react'

export interface WelcomeStep {
  title: string
  description: string
  image?: string
  icon?: React.ReactNode
}

export interface DisplayCondition {
  showOnFirstLogin?: boolean
  showForFeature?: string
  dismissible?: boolean
}

interface WelcomeModalProps {
  steps: WelcomeStep[]
  open: boolean
  onClose: () => void
  displayCondition?: DisplayCondition
  showDontShowAgain?: boolean
}

function getDismissKey(condition?: DisplayCondition): string {
  if (condition?.showForFeature) return `welcome-dismissed-${condition.showForFeature}`
  return 'welcome-dismissed'
}

export function WelcomeModal({
  steps,
  open,
  onClose,
  displayCondition,
  showDontShowAgain = true,
}: WelcomeModalProps) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [suppressed, setSuppressed] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Check if previously dismissed
  useEffect(() => {
    if (!displayCondition) return
    const key = getDismissKey(displayCondition)
    const dismissed = localStorage.getItem(key)
    if (dismissed === 'true') {
      setSuppressed(true)
    }
  }, [displayCondition])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrent(0)
    }
  }, [open])

  const handleClose = useCallback(() => {
    // Persist dismissal preference
    if (dontShowAgain || displayCondition?.showOnFirstLogin) {
      const key = getDismissKey(displayCondition)
      localStorage.setItem(key, 'true')
    }
    onClose()
  }, [displayCondition, onClose, dontShowAgain])

  if (!open || steps.length === 0 || suppressed) return null
  const dismissible = displayCondition?.dismissible !== false

  const step = steps[current]!
  const isFirst = current === 0
  const isLast = current === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismissible ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl mx-4">
        {/* Close button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={t('Close')}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Step Content */}
        <div className="flex flex-col items-center text-center">
          {step.icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {step.icon}
            </div>
          )}
          {step.image && (
            <img
              src={step.image}
              alt={step.title}
              className="mb-4 h-40 w-auto rounded-lg object-contain"
            />
          )}
          <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Step dots */}
        {steps.length > 1 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? 'w-6 bg-blue-600'
                    : idx < current
                      ? 'w-2 bg-blue-300'
                      : 'w-2 bg-gray-300'
                }`}
                aria-label={`${t('Step')} ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Don't show again checkbox */}
        {showDontShowAgain && isLast && (
          <div className="mt-4 flex justify-center">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {t("Don't show this again")}
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={isFirst}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:invisible transition-colors"
          >
            {t('Previous')}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) {
                handleClose()
              } else {
                setCurrent((c) => c + 1)
              }
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isLast ? t('Get Started') : t('Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { FormConfig, FormField } from './types'
import FormFieldRenderer from './FormFieldRenderer'
import { cn } from '@/lib/utils'
import { LottieLoader } from '@/components/ui/lottie-loader'

interface FormRendererProps {
  config: FormConfig
  onSubmit: (data: Record<string, string | string[]>) => Promise<void>
  className?: string
}

/**
 * Public-facing form renderer that takes a FormConfig JSON and renders
 * a fully functional form with validation and submission handling.
 */
export default function FormRenderer({ config, onSubmit, className }: FormRendererProps) {
  const { t } = useTranslation();
  const { fields, settings } = config
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateField = useCallback((field: FormField, value: string | string[]): string | null => {
    const strValue = Array.isArray(value) ? value.join(',') : value

    // Required check
    if (field.required) {
      if (Array.isArray(value) && value.length === 0) {
        return `${field.label} ${t('is required')}`
      }
      if (!strValue || strValue.trim() === '') {
        return `${field.label} ${t('is required')}`
      }
    }

    // Skip further validation if empty and not required
    if (!strValue) return null

    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(strValue)) {
        return t('Please enter a valid email address')
      }
    }

    // Phone validation
    if (field.type === 'phone') {
      const phoneRegex = /^[+]?[\d\s\-().]{7,}$/
      if (!phoneRegex.test(strValue)) {
        return t('Please enter a valid phone number')
      }
    }

    // Min/max length
    if (field.validation?.minLength && strValue.length < field.validation.minLength) {
      return `${t('Minimum')} ${field.validation.minLength} ${t('characters required')}`
    }
    if (field.validation?.maxLength && strValue.length > field.validation.maxLength) {
      return `${t('Maximum')} ${field.validation.maxLength} ${t('characters allowed')}`
    }

    // Number min/max
    if (field.type === 'number' && strValue) {
      const numValue = parseFloat(strValue)
      if (field.validation?.min !== undefined && numValue < field.validation.min) {
        return `Value must be at least ${field.validation.min}`
      }
      if (field.validation?.max !== undefined && numValue > field.validation.max) {
        return `Value must be at most ${field.validation.max}`
      }
    }

    // Pattern
    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern)
      if (!regex.test(strValue)) {
        return t('Invalid format')
      }
    }

    return null
  }, [])

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    for (const field of fields) {
      const value = values[field.id] || (field.type === 'checkbox' ? [] : '')
      const error = validateField(field, value)
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }, [fields, values, validateField])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitError(null)

      if (!validateAll()) return

      setSubmitting(true)

      try {
        await onSubmit(values)
        setSubmitted(true)

        // Redirect if configured — validate protocol to prevent javascript: XSS
        if (settings.redirectUrl) {
          try {
            const redirectTarget = new URL(settings.redirectUrl, window.location.origin)
            if (redirectTarget.protocol === 'https:' || redirectTarget.protocol === 'http:') {
              window.location.href = redirectTarget.toString()
            }
          } catch {
            // Invalid URL — skip redirect silently
          }
        }
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : t('An error occurred. Please try again.')
        )
      } finally {
        setSubmitting(false)
      }
    },
    [values, validateAll, onSubmit, settings.redirectUrl]
  )

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | string[]) => {
      setValues((prev) => ({ ...prev, [fieldId]: value }))
      // Clear error on change
      if (errors[fieldId]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[fieldId]
          return next
        })
      }
    },
    [errors]
  )

  // Success state
  if (submitted) {
    return (
      <div className={cn('rounded-lg bg-white p-8 text-center', className)}>
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900">
          {settings.successMessage || t('Thank you! Your response has been submitted.')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      {settings.title && (
        <h2 className="text-xl font-semibold text-gray-900">{settings.title}</h2>
      )}
      {settings.description && (
        <p className="text-sm text-gray-600">{settings.description}</p>
      )}

      {fields.map((field) => (
        <FormFieldRenderer
          key={field.id}
          field={field}
          value={values[field.id] || (field.type === 'checkbox' ? [] : '')}
          onChange={(val) => handleFieldChange(field.id, val)}
          error={errors[field.id]}
        />
      ))}

      {submitError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <LottieLoader size={80} />
            {t('Submitting...')}
          </span>
        ) : (
          settings.submitButtonText || t('Submit')
        )}
      </button>
    </form>
  )
}

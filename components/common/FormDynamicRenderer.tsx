'use client'

import { useState, useCallback, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import QuestionRenderer from '@/components/features/lead-forms/questions/QuestionRenderer'
import type { LeadFormField, ValidationRule } from '@/types/entities/lead-form'

interface FormDynamicRendererProps {
  fields: LeadFormField[]
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  submitLabel?: string
  className?: string
}

function validateField(
  field: LeadFormField,
  value: unknown
): string | null {
  if (
    field.required &&
    (!value ||
      (typeof value === 'string' && !value.trim()) ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return `${field.label} is required`
  }

  if (!value) return null

  const validation: ValidationRule | undefined = field.validation
  if (!validation) return null

  if (typeof value === 'string') {
    if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    if (field.type === 'tel') {
      if (!/^[\d\s\-+()]+$/.test(value)) {
        return 'Please enter a valid phone number'
      }
    }

    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`
    }

    if (validation.pattern) {
      try {
        if (!new RegExp(validation.pattern).test(value)) {
          return `${field.label} format is invalid`
        }
      } catch {
        // Invalid regex — skip
      }
    }
  }

  if (field.type === 'number' && typeof value === 'string') {
    const num = parseFloat(value)
    if (isNaN(num)) return 'Please enter a valid number'
    if (validation.min !== undefined && num < validation.min) {
      return `${field.label} must be at least ${validation.min}`
    }
    if (validation.max !== undefined && num > validation.max) {
      return `${field.label} must be no more than ${validation.max}`
    }
  }

  return null
}

export default function FormDynamicRenderer({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className,
}: FormDynamicRendererProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const sortedFields = [...fields].sort((a, b) => a.order - b.order)

  const handleChange = useCallback(
    (fieldName: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }))
      setErrors((prev) => {
        if (!prev[fieldName]) return prev
        const next = { ...prev }
        delete next[fieldName]
        return next
      })
    },
    []
  )

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    for (const field of sortedFields) {
      const err = validateField(field, formData[field.name])
      if (err) newErrors[field.name] = err
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className ?? 'space-y-6'}>
      {sortedFields.map((field) => (
        <QuestionRenderer
          key={field.id}
          field={field}
          value={formData[field.name] ?? ''}
          onChange={(v) => handleChange(field.name, v)}
          error={errors[field.name]}
        />
      ))}

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Submission Failed</h4>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {sortedFields.some((f) => f.required) && (
        <p className="text-sm text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      )}
    </form>
  )
}

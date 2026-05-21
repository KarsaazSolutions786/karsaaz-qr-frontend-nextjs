'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  useBillingCollectionEnabled,
  useBillingCollectionForm,
} from '@/lib/hooks/queries/useBillingCollection'

// ─── Types ───────────────────────────────────────────────────────────────────

type CustomerType = 'private' | 'company'

interface BillingDetailsCollectorProps {
  /**
   * Called when billing details are successfully collected.
   * Passes the form response ID so the checkout can attach it.
   */
  onCollected?: (formResponseId: string) => void
  /**
   * Render the checkout content (payment buttons etc.).
   * Only rendered if billing collection is disabled OR details are already submitted.
   */
  children: React.ReactNode
}

const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'company', label: 'Company' },
]

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Purpose: Executes BillingDetailsCollector functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function BillingDetailsCollector({
  onCollected,
  children,
}: BillingDetailsCollectorProps) {
  const { t } = useTranslation()
  const [customerType, setCustomerType] = useState<CustomerType>('private')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [responseId, setResponseId] = useState<string | null>(null)

  const { data: billingEnabled, isLoading: loadingEnabled } =
    useBillingCollectionEnabled()

  const { data: customFormId, isLoading: loadingForm } =
    useBillingCollectionForm(customerType, billingEnabled ?? false)

  const handleFormSubmitted = useCallback(
    (formResponseId: string) => {
      setResponseId(formResponseId)
      setIsSubmitted(true)
      onCollected?.(formResponseId)
    },
    [onCollected]
  )

  const handleChangeDetails = useCallback(() => {
    setIsSubmitted(false)
    setResponseId(null)
  }, [])

  // Loading state
  if (loadingEnabled) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  // Billing collection disabled: pass through to checkout content
  if (!billingEnabled) {
    return <>{children}</>
  }

  // Already submitted: show preview + allow edit
  if (isSubmitted && responseId) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800">
                {t('Billing Details Saved')}
              </h3>
              <p className="mt-1 text-xs text-green-600">
                {t('Your billing information has been recorded.')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleChangeDetails}
              className="rounded-md border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              {t('Change')}
            </button>
          </div>
        </div>
        {children}
      </div>
    )
  }

  // Show billing details collection form
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t('Billing Details')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('Please provide your billing information before proceeding to payment.')}
        </p>
      </div>

      {/* Customer Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Type')}
        </label>
        <div className="flex gap-3">
          {CUSTOMER_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => {
                setCustomerType(ct.value)
                setIsSubmitted(false)
                setResponseId(null)
              }}
              className={`flex-1 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                customerType === ct.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t(ct.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Form */}
      {loadingForm ? (
        <div className="flex items-center justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : customFormId ? (
        <BillingFormRenderer
          formId={customFormId}
          onSubmit={handleFormSubmitted}
        />
      ) : (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          {t(
            'No billing form configured for this customer type. Please contact support.'
          )}
        </div>
      )}
    </div>
  )
}

// ─── Billing Form Renderer ───────────────────────────────────────────────────
// This renders a custom form by ID. It submits the form response and returns
// the response ID so the checkout flow can attach it to the transaction.

interface BillingFormRendererProps {
  formId: string
  onSubmit: (responseId: string) => void
}

/**
 * Purpose: Executes BillingFormRenderer functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function BillingFormRenderer({ formId, onSubmit }: BillingFormRendererProps) {
  const { t } = useTranslation()
  const [fields, setFields] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Purpose: Executes handleFieldChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleFieldChange = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Import apiClient dynamically to avoid circular deps
      const { default: apiClient } = await import('@/lib/api/client')
      const response = await apiClient.post<{ data: { id: string } }>(
        `/custom-forms/${formId}/responses`,
        { fields }
      )
      onSubmit(response.data.data.id)
    } catch {
      setError(t('Failed to save billing details. Please try again.'))
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic billing fields — these are rendered based on the custom form.
          Since the backend uses a custom form builder, we provide common billing
          fields that cover typical private/company forms. The actual form structure
          comes from the custom form configuration in the admin panel. */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('Full Name / Company Name')}
        </label>
        <input
          type="text"
          value={fields['name'] || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('Email')}
        </label>
        <input
          type="email"
          value={fields['email'] || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Country')}
          </label>
          <input
            type="text"
            value={fields['country'] || ''}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('City')}
          </label>
          <input
            type="text"
            value={fields['city'] || ''}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('Address')}
        </label>
        <input
          type="text"
          value={fields['address'] || ''}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Postal Code')}
          </label>
          <input
            type="text"
            value={fields['postal_code'] || ''}
            onChange={(e) => handleFieldChange('postal_code', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Tax ID / VAT Number')}
          </label>
          <input
            type="text"
            value={fields['tax_id'] || ''}
            onChange={(e) => handleFieldChange('tax_id', e.target.value)}
            placeholder={t('Optional')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {submitting ? t('Saving...') : t('Save Billing Details')}
      </button>
    </form>
  )
}

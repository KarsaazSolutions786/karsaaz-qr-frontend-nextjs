'use client'

import { useState } from 'react'

export interface PromoCodeFormValues {
  code: string
  discount_percentage: number
  expires_at: string
  usage_limit: number | null
  is_active: boolean
}

interface PromoCodeFormProps {
  initialValues?: Partial<PromoCodeFormValues>
  onSubmit: (values: PromoCodeFormValues) => Promise<void>
  isEdit?: boolean
}

export function PromoCodeForm({ initialValues, onSubmit, isEdit }: PromoCodeFormProps) {
  const [code, setCode] = useState(initialValues?.code ?? '')
  const [discountPercentage, setDiscountPercentage] = useState(
    initialValues?.discount_percentage ?? 10
  )
  const [expiresAt, setExpiresAt] = useState(initialValues?.expires_at ?? '')
  const [usageLimit, setUsageLimit] = useState<string>(
    initialValues?.usage_limit != null ? String(initialValues.usage_limit) : ''
  )
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)

    if (!code.trim()) {
      setError('Promo code is required.')
      return
    }
    if (discountPercentage < 1 || discountPercentage > 100) {
      setError('Discount must be between 1% and 100%.')
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        code: code.toUpperCase().trim(),
        discount_percentage: discountPercentage,
        expires_at: expiresAt || '',
        usage_limit: usageLimit ? parseInt(usageLimit, 10) : null,
        is_active: isActive,
      })
    } catch {
      setError('Failed to save promo code. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div>
        <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">
          Promo Code
        </label>
        <input
          id="promo-code"
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. SUMMER25"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="discount-percentage" className="block text-sm font-medium text-gray-700">
          Discount Percentage
        </label>
        <div className="relative mt-1">
          <input
            id="discount-percentage"
            type="number"
            min={1}
            max={100}
            value={discountPercentage}
            onChange={e => setDiscountPercentage(Number(e.target.value))}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
            %
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="expires-at" className="block text-sm font-medium text-gray-700">
          Expiry Date (Optional)
        </label>
        <input
          id="expires-at"
          type="date"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="usage-limit" className="block text-sm font-medium text-gray-700">
          Usage Limit (Optional)
        </label>
        <input
          id="usage-limit"
          type="number"
          min={1}
          value={usageLimit}
          onChange={e => setUsageLimit(e.target.value)}
          placeholder="Unlimited if empty"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is-active"
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is-active" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving…' : isEdit ? 'Update Promo Code' : 'Create Promo Code'}
      </button>
    </form>
  )
}

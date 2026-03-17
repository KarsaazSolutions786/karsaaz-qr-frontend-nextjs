'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { promoCodesAPI, type CreatePromoCodeRequest } from '@/lib/api/endpoints/promo-codes'
import { useTranslation } from '@/lib/i18n'

export default function NewPromoCodePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [code, setCode] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [usageLimit, setUsageLimit] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const payload: CreatePromoCodeRequest = {
        code: code.trim().toUpperCase(),
        discount_percentage: Number(discountPercentage),
        is_active: isActive,
      }
      if (expiresAt) payload.expires_at = expiresAt
      if (usageLimit) payload.usage_limit = Number(usageLimit)

      await promoCodesAPI.create(payload)
      toast.success(t('Promo code created successfully'))
      router.push('/promo-codes')
    } catch (err: any) {
      if (err?.response?.status === 422) {
        setErrors(err.response.data?.errors || {})
      } else {
        toast.error(t('Failed to create promo code'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/promo-codes" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; {t('Back to Promo Codes')}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{t('Create Promo Code')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Code')}</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SAVE20"
            required
            disabled={loading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
          {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Discount Percentage')}</label>
          <div className="relative mt-1">
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="20"
              required
              disabled={loading}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
          </div>
          {errors.discount_percentage && <p className="mt-1 text-xs text-red-600">{errors.discount_percentage[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Expiry Date')}</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">{t('Leave empty for no expiry')}</p>
          {errors.expires_at && <p className="mt-1 text-xs text-red-600">{errors.expires_at[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Usage Limit')}</label>
          <input
            type="number"
            min="1"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder={t('Unlimited')}
            disabled={loading}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">{t('Leave empty for unlimited usage')}</p>
          {errors.usage_limit && <p className="mt-1 text-xs text-red-600">{errors.usage_limit[0]}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            {t('Active')}
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Link
            href="/promo-codes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t('Creating...') : t('Create Promo Code')}
          </button>
        </div>
      </form>
    </div>
  )
}

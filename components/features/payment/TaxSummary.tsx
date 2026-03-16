'use client'

import { useState, useEffect } from 'react'
import { checkoutAPI, type TaxCalculation } from '@/lib/api/endpoints/account'
import { useTranslation } from '@/lib/i18n'

interface TaxSummaryProps {
  planId: number
  planPrice: number
  country: string
  state?: string
}

export function TaxSummary({ planId, planPrice, country, state }: TaxSummaryProps) {
  const { t } = useTranslation()
  const [tax, setTax] = useState<TaxCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!country) {
      setTax(null)
      return
    }

    let cancelled = false
    const fetchTax = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await checkoutAPI.calculateTax({ plan_id: planId, country, state })
        if (!cancelled) setTax(result)
      } catch {
        if (!cancelled) {
          setError(t('Could not calculate tax'))
          setTax(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const timer = setTimeout(fetchTax, 500) // debounce
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [planId, country, state])

  const subtotal = planPrice / 100

  if (!country) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('Subtotal')}</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>{t('Tax')}</span>
          <span>{t('Select country to calculate')}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <span className="font-semibold text-gray-900">{t('Total')}</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}/{t('month')}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('Subtotal')}</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>{t('Tax')}</span>
          <span>{t('Calculating...')}</span>
        </div>
      </div>
    )
  }

  if (error || !tax) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('Subtotal')}</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        {error && (
          <div className="text-xs text-yellow-600">{error}</div>
        )}
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <span className="font-semibold text-gray-900">{t('Total')}</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}/{t('month')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">{t('Subtotal')}</span>
        <span className="font-medium text-gray-900">${(tax.subtotal / 100).toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">{t('Tax')} ({(tax.tax_rate * 100).toFixed(1)}%)</span>
        <span className="font-medium text-gray-900">${(tax.tax_amount / 100).toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-2">
        <span className="font-semibold text-gray-900">{t('Total')}</span>
        <span className="font-semibold text-gray-900">${(tax.total / 100).toFixed(2)}/{t('month')}</span>
      </div>
    </div>
  )
}

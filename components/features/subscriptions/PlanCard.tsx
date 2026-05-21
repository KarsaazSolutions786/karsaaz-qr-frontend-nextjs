'use client'

import React, { memo } from 'react'
import { Plan } from '@/types/entities/subscription'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

interface PlanCardProps {
  plan: Plan
  current?: boolean
}

/**
 * Purpose: Executes formatFrequency functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function formatFrequency(freq: string | undefined, t: (key: string) => string) {
  switch (freq) {
    case 'yearly':
      return `/${t('year')}`
    case 'life-time':
      return ` ${t('one-time')}`
    default:
      return `/${t('month')}`
  }
}

/**
 * Purpose: Executes formatLimit functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function formatLimit(value: number | null | undefined, label: string, t: (key: string) => string) {
  if (value === null || value === undefined) return `${t('Unlimited')} ${label}`
  if (value === -1) return `${t('Unlimited')} ${label}`
  return `${value.toLocaleString()} ${label}`
}

export const PlanCard = memo(function PlanCard({ plan, current = false }: PlanCardProps) {
  const { t } = useTranslation()
  const price = Number(plan.price).toFixed(2)
  const isPopular = plan.name.toLowerCase() === 'pro'

  return (
    <div
      className={`relative rounded-lg border-2 bg-white p-8 shadow-sm ${
        isPopular ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
            {t('Most Popular')}
          </span>
        </div>
      )}

      {current && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-semibold text-white">
            {t('Current Plan')}
          </span>
        </div>
      )}

      {plan.isTrial && (
        <div className="absolute -top-4 right-4 flex justify-center">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            {plan.trialDays} {t('days trial')}
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-600">{formatFrequency(plan.frequency, t)}</span>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        <li className="flex items-start">
          <span className="text-green-500 mr-3">✓</span>
          <span className="text-sm text-gray-700">
            {formatLimit(plan.limits.maxQRCodes, t('QR codes'), t)}
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-3">✓</span>
          <span className="text-sm text-gray-700">
            {formatLimit(plan.limits.maxScans, t('scans'), t)}
          </span>
        </li>
        {plan.limits.maxDomains !== undefined &&
          plan.limits.maxDomains !== null &&
          plan.limits.maxDomains > 0 && (
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-sm text-gray-700">
                {formatLimit(plan.limits.maxDomains, t('custom domains'), t)}
              </span>
            </li>
          )}
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {current ? (
          <div className="rounded-md border-2 border-green-500 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
            {t('Active Plan')}
          </div>
        ) : (
          <Link
            href={`/checkout?plan-id=${plan.id}`}
            className={`block rounded-md px-4 py-3 text-center text-sm font-semibold transition ${
              isPopular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {plan.isTrial ? t('Start Free Trial') : t('Subscribe')}
          </Link>
        )}
      </div>
    </div>
  )
})

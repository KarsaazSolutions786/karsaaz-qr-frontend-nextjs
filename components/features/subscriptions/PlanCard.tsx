'use client'

import { Plan } from '@/types/entities/subscription'
import Link from 'next/link'

interface PlanCardProps {
  plan: Plan
  current?: boolean
}

function formatFrequency(freq?: string) {
  switch (freq) {
    case 'yearly': return '/year'
    case 'life-time': return ' one-time'
    default: return '/month'
  }
}

function formatLimit(value: number | null | undefined, label: string) {
  if (value === null || value === undefined) return `Unlimited ${label}`
  if (value === -1) return `Unlimited ${label}`
  return `${value.toLocaleString()} ${label}`
}

export function PlanCard({ plan, current = false }: PlanCardProps) {
  const price = Number(plan.price).toFixed(2)
  const isPopular = plan.name.toLowerCase() === 'pro'

  return (
    <div className={`relative rounded-lg border-2 bg-white p-8 shadow-sm ${
      isPopular ? 'border-blue-500' : 'border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        </div>
      )}

      {current && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-green-500 px-4 py-1 text-xs font-semibold text-white">
            Current Plan
          </span>
        </div>
      )}

      {plan.isTrial && (
        <div className="absolute -top-4 right-4 flex justify-center">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            {plan.trialDays} days trial
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-600">{formatFrequency(plan.frequency)}</span>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        <li className="flex items-start">
          <span className="text-green-500 mr-3">✓</span>
          <span className="text-sm text-gray-700">{formatLimit(plan.limits.maxQRCodes, 'QR codes')}</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-3">✓</span>
          <span className="text-sm text-gray-700">{formatLimit(plan.limits.maxScans, 'scans')}</span>
        </li>
        {plan.limits.maxDomains !== undefined && plan.limits.maxDomains !== null && plan.limits.maxDomains > 0 && (
          <li className="flex items-start">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-sm text-gray-700">{formatLimit(plan.limits.maxDomains, 'custom domains')}</span>
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
            Active Plan
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
            {plan.isTrial ? 'Start Free Trial' : 'Subscribe'}
          </Link>
        )}
      </div>
    </div>
  )
}

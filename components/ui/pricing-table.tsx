'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PlanFeature {
  name: string
  included: boolean
}

export interface PlanCard {
  id: string
  name: string
  price: string
  description?: string
  features: PlanFeature[]
  recommended?: boolean
  cta?: string
}

export interface PricingTableProps {
  plans: PlanCard[]
  onSelect?: (planId: string) => void
  currentPlanId?: string
  className?: string
}

export function PricingTable({ plans, onSelect, currentPlanId, className }: PricingTableProps) {
  return (
    <div className={cn('grid gap-6', plans.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4', className)}>
      {plans.map((plan) => {
        const isCurrent = currentPlanId === plan.id
        return (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md',
              plan.recommended
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-200'
            )}
          >
            {plan.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                Recommended
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900">{plan.price}</p>
            {plan.description && (
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
            )}
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feat) => (
                <li key={feat.name} className="flex items-center gap-2 text-sm">
                  {feat.included ? (
                    <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={feat.included ? 'text-gray-700' : 'text-gray-400'}>{feat.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelect?.(plan.id)}
              disabled={isCurrent}
              className={cn(
                'mt-6 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                plan.recommended
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              {isCurrent ? 'Current Plan' : plan.cta || 'Select Plan'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

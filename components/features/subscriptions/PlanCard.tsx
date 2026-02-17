'use client'

import { Plan } from '@/types/entities/subscription'
import Link from 'next/link'

interface PlanCardProps {
  plan: Plan
  current?: boolean
}

export function PlanCard({ plan, current = false }: PlanCardProps) {
  const price = (plan.price / 100).toFixed(2)
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

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-600">/month</span>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-2">
        {plan.limits.maxQRCodes && (
          <p className="text-xs text-gray-500">
            Up to {plan.limits.maxQRCodes.toLocaleString()} QR codes
          </p>
        )}
        {plan.limits.maxQRCodes === null && (
          <p className="text-xs text-gray-500">Unlimited QR codes</p>
        )}
        {plan.limits.analytics && (
          <p className="text-xs text-gray-500">Advanced analytics included</p>
        )}
      </div>

      <div className="mt-8">
        {current ? (
          <div className="rounded-md border-2 border-green-500 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
            Active Plan
          </div>
        ) : (
          <Link
            href={`/checkout?plan=${plan.id}`}
            className={`block rounded-md px-4 py-3 text-center text-sm font-semibold transition ${
              isPopular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  )
}

'use client'

import { usePlans } from '@/lib/hooks/queries/usePlans'
import { PlanCard } from './PlanCard'
import type { Plan } from '@/types/entities/subscription'
import { mapSubscriptionPlanToPlan } from '@/lib/utils/plan-mapper'

export function PricingPlans({ billingMode }: { billingMode?: string }) {
  const { data: plansData, isLoading, error } = usePlans()
  const allPlans: Plan[] | undefined = plansData?.data
    ?.filter((sp) => !sp.isHidden)
    .map(mapSubscriptionPlanToPlan)

  // Filter by frequency when billingMode is specified
  const plans = allPlans?.filter((plan) => {
    if (!billingMode || billingMode === 'all') return true
    if (billingMode === 'monthly') return plan.frequency === 'monthly'
    if (billingMode === 'annual' || billingMode === 'yearly') return plan.frequency === 'yearly'
    return true
  })

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
            <div className="h-6 w-24 rounded bg-gray-200"></div>
            <div className="mt-4 h-10 w-32 rounded bg-gray-200"></div>
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-full rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">Failed to load pricing plans. Please try again later.</p>
      </div>
    )
  }

  if (!plans || plans?.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-600">No plans available at this time.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}

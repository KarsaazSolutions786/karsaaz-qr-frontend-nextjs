'use client'

import { useState } from 'react'
import { BillingModeToggle } from '@/components/features/plans/BillingModeToggle'
import { PricingPlans } from './PricingPlans'

type BillingMode = 'monthly' | 'annual' | 'credit'

/**
 * Purpose: Executes PricingPageContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function PricingPageContent() {
  const [billingMode, setBillingMode] = useState<BillingMode>('monthly')

  return (
    <div className="space-y-8">
      {/* Billing mode toggle */}
      <div className="flex justify-center">
        <BillingModeToggle mode={billingMode} onChange={setBillingMode} />
      </div>

      {/* Plans grid — passes billing mode for future filtering */}
      <PricingPlans billingMode={billingMode} />
    </div>
  )
}

import type { SubscriptionPlan } from '@/types/entities/plan'
import type { Plan } from '@/types/entities/subscription'

/**
 * Maps an admin SubscriptionPlan to a user-facing Plan type.
 * Used by checkout, pricing, and subscription detail components.
 */
export function mapSubscriptionPlanToPlan(sp: SubscriptionPlan): Plan {
  return {
    id: String(sp.id),
    name: sp.name,
    price: sp.price,
    currency: 'USD',
    features: sp.features ?? [],
    limits: {
      maxQRCodes: sp.numberOfDynamicQrcodes ?? null,
      maxDomains: sp.numberOfCustomDomains ?? null,
      maxScans: sp.numberOfScans ?? null,
      analytics: true,
      customBranding: true,
      apiAccess: true,
    },
  }
}

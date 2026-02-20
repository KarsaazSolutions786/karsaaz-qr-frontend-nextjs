export interface Plan {
  id: string // UUID
  name: string // e.g., "Pro", "Enterprise"
  price: number // Monthly price in cents
  currency: string // e.g., "USD"
  features: string[] // List of features
  limits: PlanLimits // Feature limits
  stripeProductId?: string // Stripe product ID
  stripePriceId?: string // Stripe price ID
}

export interface PlanLimits {
  maxQRCodes: number | null // null = unlimited
  maxDomains: number | null
  maxScans: number | null // Per month
  analytics: boolean
  customBranding: boolean
  apiAccess: boolean
}

export interface Subscription {
  id: string // UUID
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'expired' | 'trial'
  currentPeriodStart: string // ISO 8601
  currentPeriodEnd: string // ISO 8601
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string // Stripe subscription ID
  stripeCustomerId?: string // Stripe customer ID
  createdAt: string
  updatedAt: string
  /** Plan details populated by backend */
  plan?: {
    id: string
    name: string
    qr_codes_limit?: number | null
    scans_limit?: number | null
  }
  /** Whether subscription is currently on trial */
  on_trial?: boolean
  trial_ends_at?: string
}

export interface PromoCode {
  id: string
  code: string // e.g., "SAVE20"
  discountType: 'percentage' | 'fixed' // percentage or fixed amount
  discountValue: number // 20 (for 20%) or 1000 (for $10.00)
  validFrom: string // ISO 8601
  validUntil: string // ISO 8601
  maxUses?: number // null = unlimited
  currentUses: number
  active: boolean
}

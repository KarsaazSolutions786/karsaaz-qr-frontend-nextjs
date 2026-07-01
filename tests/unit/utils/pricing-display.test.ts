import { describe, expect, it } from 'vitest'
import { buildChatbotPricingText, SSR_PRICING_FALLBACK } from '@/lib/utils/pricing-display'
import type { SubscriptionPlan } from '@/types/entities/plan'

function makePlan(overrides: Partial<SubscriptionPlan>): SubscriptionPlan {
  return {
    id: 1,
    name: 'STARTER',
    price: 12,
    frequency: 'yearly',
    sortOrder: 0,
    isHidden: false,
    isTrial: false,
    numberOfDynamicQrcodes: 10,
    numberOfScans: 10000,
    numberOfCustomDomains: 1,
    showAds: false,
    qrTypes: [],
    features: [],
    createdAt: '',
    updatedAt: '',
    storageQuotaBytes: 524288000,
    ...overrides,
  }
}

describe('buildChatbotPricingText', () => {
  it('uses yearly backend plans and excludes hidden/trial', () => {
    const text = buildChatbotPricingText([
      makePlan({ id: 1, name: 'STARTER', price: 12, frequency: 'yearly' }),
      makePlan({ id: 2, name: 'LITE', price: 18, frequency: 'yearly' }),
      makePlan({ id: 3, name: 'PRO', price: 24, frequency: 'yearly' }),
      makePlan({ id: 4, name: 'TRIAL', price: 0, isTrial: true, isHidden: true }),
      makePlan({ id: 5, name: 'STARTER', price: 1, frequency: 'monthly' }),
    ])

    expect(text).toContain('STARTER Plan')
    expect(text).toContain('$12/year')
    expect(text).toContain('LITE Plan')
    expect(text).not.toContain('TRIAL')
    expect(text).not.toContain('$9/month')
  })

  it('falls back when no plans', () => {
    expect(buildChatbotPricingText([])).toContain('/pricing')
  })
})

describe('SSR_PRICING_FALLBACK', () => {
  it('matches seeder yearly tiers', () => {
    expect(SSR_PRICING_FALLBACK.map(p => p.price)).toEqual(['$12', '$18', '$24'])
  })
})

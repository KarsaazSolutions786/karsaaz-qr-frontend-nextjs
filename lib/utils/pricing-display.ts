import type { SubscriptionPlan } from '@/types/entities/plan'

/** SSR fallback aligned with SubscriptionPlanFactory seeder defaults (yearly). */
export type SsrPricingPlan = {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
}

export const SSR_PRICING_FALLBACK: SsrPricingPlan[] = [
  {
    name: 'Starter',
    price: '$12',
    period: '/year',
    features: ['500 MB storage', '10 dynamic QR codes', '10,000 scans', 'Custom designs'],
  },
  {
    name: 'Lite',
    price: '$18',
    period: '/year',
    features: ['1 GB storage', '15 dynamic QR codes', '15,000 scans', 'Premium templates'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/year',
    features: [
      '5 GB storage',
      '17 dynamic QR codes',
      '17,000 scans',
      'Advanced analytics',
      'Priority support',
    ],
  },
]

function formatStorage(bytes?: number): string | null {
  if (!bytes) return null
  if (bytes >= 1073741824) return `${bytes / 1073741824} GB storage`
  if (bytes >= 1048576) return `${Math.round(bytes / 1048576)} MB storage`
  return `${Math.round(bytes / 1024)} KB storage`
}

/**
 * Build chatbot pricing copy from backend subscription_plans (single source of truth).
 */
export function buildChatbotPricingText(plans: SubscriptionPlan[]): string {
  const visible = plans.filter(p => !p.isHidden && !p.isTrial)
  const yearly = visible.filter(p => p.frequency === 'yearly')
  const toShow = (yearly.length ? yearly : visible).sort(
    (a, b) => Number(a.price) - Number(b.price)
  )

  if (toShow.length === 0) {
    return 'Please visit our pricing page at /pricing for current plan details.'
  }

  const lines: string[] = [
    'Karsaaz QR offers flexible subscription plans designed to fit every use case:',
  ]

  for (const plan of toShow) {
    const price = Number(plan.price)
    const monthly = plan.frequency === 'yearly' ? Math.round((price / 12) * 100) / 100 : price

    lines.push('', `${plan.name} Plan`)
    if (plan.frequency === 'yearly') {
      lines.push(`● $${monthly}/month or $${price}/year (billed annually)`)
    } else {
      lines.push(`● $${price}/month`)
    }
    if (plan.numberOfDynamicQrcodes) {
      lines.push(`● ${plan.numberOfDynamicQrcodes} dynamic QR codes`)
    }
    if (plan.numberOfScans) {
      lines.push(`● ${plan.numberOfScans.toLocaleString()} scans per month`)
    }
    const storage = formatStorage(plan.storageQuotaBytes)
    if (storage) lines.push(`● ${storage}`)
    if (plan.numberOfCustomDomains) {
      lines.push(`● ${plan.numberOfCustomDomains} custom domain(s)`)
    }
  }

  lines.push(
    '',
    'All plans include:',
    '● Secure cloud infrastructure',
    '● Real-time analytics dashboard',
    '● GDPR & PECA 2025 compliance',
    '● Upgrade/downgrade flexibility with no hidden fees',
    '',
    'Visit /pricing for live plan details and checkout.'
  )

  return lines.join('\n')
}

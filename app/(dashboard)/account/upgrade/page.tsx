'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { useSubscription } from '@/lib/hooks/queries/useSubscription'
import type { SubscriptionPlan } from '@/types/entities/plan'
import {
  Check,
  X,
  Crown,
  Zap,
  ArrowRight,
  Star,
  Shield,
} from 'lucide-react'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Purpose: Executes formatPrice functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function formatPrice(price: number, frequency: string): string {
  if (price === 0) return 'Free'
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  const suffix =
    frequency === 'monthly'
      ? '/mo'
      : frequency === 'yearly'
        ? '/yr'
        : frequency === 'life-time'
          ? ' one-time'
          : ''

  return `${formatted}${suffix}`
}

/**
 * Purpose: Retrieves plantier.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getPlanTier(plan: SubscriptionPlan): 'free' | 'starter' | 'pro' | 'enterprise' {
  if (plan.isTrial || plan.price === 0) return 'free'
  const name = plan.name.toLowerCase()
  if (name.includes('enterprise') || name.includes('business')) return 'enterprise'
  if (name.includes('pro') || name.includes('premium')) return 'pro'
  return 'starter'
}

/**
 * Purpose: Retrieves tiercolor.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getTierColor(tier: string): string {
  switch (tier) {
    case 'free':
      return 'border-gray-200 bg-white'
    case 'starter':
      return 'border-blue-200 bg-white'
    case 'pro':
      return 'border-purple-300 bg-purple-50 ring-2 ring-purple-200'
    case 'enterprise':
      return 'border-orange-200 bg-white'
    default:
      return 'border-gray-200 bg-white'
  }
}

/**
 * Purpose: Retrieves tierbadgecolor.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getTierBadgeColor(tier: string): string {
  switch (tier) {
    case 'free':
      return 'bg-gray-100 text-gray-700'
    case 'starter':
      return 'bg-blue-100 text-blue-700'
    case 'pro':
      return 'bg-purple-100 text-purple-700'
    case 'enterprise':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/**
 * Purpose: Retrieves buttonstyle.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getButtonStyle(tier: string, isCurrent: boolean): string {
  if (isCurrent) {
    return 'border border-gray-300 bg-white text-gray-700 cursor-default'
  }
  switch (tier) {
    case 'pro':
      return 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
    case 'enterprise':
      return 'bg-orange-600 text-white hover:bg-orange-700'
    case 'starter':
      return 'bg-blue-600 text-white hover:bg-blue-700'
    default:
      return 'bg-gray-800 text-white hover:bg-gray-900'
  }
}

// ── Plan Card ────────────────────────────────────────────────────────────

/**
 * Purpose: Executes PlanCard functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
}: {
  plan: SubscriptionPlan
  isCurrentPlan: boolean
  onSelect: (plan: SubscriptionPlan) => void
}) {
  const { t } = useTranslation()
  const tier = getPlanTier(plan)
  const isPro = tier === 'pro'

  const checkpoints = plan.checkpoints ?? []
  const features = plan.features ?? []

  return (
    <div
      className={`relative flex flex-col rounded-xl border-2 p-6 transition-shadow hover:shadow-lg ${getTierColor(tier)}`}
    >
      {/* Popular badge */}
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <Star className="h-3 w-3" />
            {t('Most Popular')}
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            <Check className="h-3 w-3" />
            {t('Current Plan')}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getTierBadgeColor(tier)}`}
        >
          {tier === 'enterprise' && <Shield className="h-3 w-3" />}
          {tier === 'pro' && <Crown className="h-3 w-3" />}
          {tier === 'starter' && <Zap className="h-3 w-3" />}
          {plan.name}
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {plan.price === 0 ? t('Free') : `$${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-gray-500">
              /{plan.frequency === 'monthly' ? t('mo') : plan.frequency === 'yearly' ? t('yr') : t('one-time')}
            </span>
          )}
        </div>
        {plan.isTrial && plan.trialDays && (
          <p className="mt-1 text-sm text-gray-500">
            {t('{{days}}-day free trial').replace('{{days}}', String(plan.trialDays))}
          </p>
        )}
      </div>

      {/* Key limits */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-sm text-gray-600">{t('QR Codes')}</span>
          <span className="text-sm font-semibold text-gray-900">
            {plan.numberOfDynamicQrcodes === -1
              ? t('Unlimited')
              : plan.numberOfDynamicQrcodes.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-sm text-gray-600">{t('Scans')}</span>
          <span className="text-sm font-semibold text-gray-900">
            {plan.numberOfScans === -1
              ? t('Unlimited')
              : plan.numberOfScans.toLocaleString()}
          </span>
        </div>
        {plan.numberOfCustomDomains > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{t('Custom Domains')}</span>
            <span className="text-sm font-semibold text-gray-900">
              {plan.numberOfCustomDomains === -1
                ? t('Unlimited')
                : plan.numberOfCustomDomains}
            </span>
          </div>
        )}
        {plan.numberOfUsers && plan.numberOfUsers > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{t('Team Members')}</span>
            <span className="text-sm font-semibold text-gray-900">
              {plan.numberOfUsers === -1
                ? t('Unlimited')
                : plan.numberOfUsers}
            </span>
          </div>
        )}
      </div>

      {/* Features / checkpoints */}
      <div className="mb-6 flex-1">
        <ul className="space-y-2.5">
          {checkpoints.length > 0
            ? checkpoints.map((cp) => (
                <li
                  key={cp.id}
                  className="flex items-start gap-2 text-sm"
                >
                  {cp.available ? (
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" />
                  )}
                  <span
                    className={
                      cp.available ? 'text-gray-700' : 'text-gray-400'
                    }
                  >
                    {cp.text}
                  </span>
                </li>
              ))
            : features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{feat}</span>
                </li>
              ))}

          {!plan.showAds && (
            <li className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-gray-700">{t('No advertisements')}</span>
            </li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={() => !isCurrentPlan && onSelect(plan)}
        disabled={isCurrentPlan}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all disabled:cursor-default ${getButtonStyle(tier, isCurrentPlan)}`}
      >
        {isCurrentPlan ? (
          t('Current Plan')
        ) : (
          <>
            {t('Upgrade')}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  )
}

// ── Comparison Table ─────────────────────────────────────────────────────

/**
 * Purpose: Executes ComparisonTable functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function ComparisonTable({ plans }: { plans: SubscriptionPlan[] }) {
  const { t } = useTranslation()

  const rows = [
    {
      label: t('Dynamic QR Codes'),
      getValue: (p: SubscriptionPlan) =>
        p.numberOfDynamicQrcodes === -1
          ? t('Unlimited')
          : String(p.numberOfDynamicQrcodes),
    },
    {
      label: t('Scans / Month'),
      getValue: (p: SubscriptionPlan) =>
        p.numberOfScans === -1
          ? t('Unlimited')
          : p.numberOfScans.toLocaleString(),
    },
    {
      label: t('Custom Domains'),
      getValue: (p: SubscriptionPlan) =>
        p.numberOfCustomDomains === -1
          ? t('Unlimited')
          : String(p.numberOfCustomDomains),
    },
    {
      label: t('Team Members'),
      getValue: (p: SubscriptionPlan) =>
        !p.numberOfUsers || p.numberOfUsers <= 0
          ? '1'
          : p.numberOfUsers === -1
            ? t('Unlimited')
            : String(p.numberOfUsers),
    },
    {
      label: t('Ad-Free'),
      getValue: (p: SubscriptionPlan) => (p.showAds ? '\u2717' : '\u2713'),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 pr-4 text-left font-medium text-gray-500">
              {t('Feature')}
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className="px-4 py-3 text-center font-semibold text-gray-900"
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="py-3 pr-4 font-medium text-gray-700">
              {t('Price')}
            </td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className="px-4 py-3 text-center font-semibold text-gray-900"
              >
                {formatPrice(plan.price, plan.frequency)}
              </td>
            ))}
          </tr>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="py-3 pr-4 font-medium text-gray-700">
                {row.label}
              </td>
              {plans.map((plan) => {
                const val = row.getValue(plan)
                return (
                  <td
                    key={plan.id}
                    className={`px-4 py-3 text-center ${
                      val === '\u2713'
                        ? 'text-green-600 font-bold'
                        : val === '\u2717'
                          ? 'text-gray-300'
                          : 'text-gray-700'
                    }`}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

/**
 * Purpose: Executes AccountUpgradePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function AccountUpgradePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: plansData, isLoading: plansLoading } = usePlans()
  const { data: subscription } = useSubscription()

  const currentPlanId = subscription?.plan?.id != null ? Number(subscription.plan.id) : null

  // Sort plans by price (ascending), filter out hidden
  const plans = useMemo(() => {
    const allPlans = plansData?.data ?? []
    return allPlans
      .filter((p) => !p.isHidden)
      .sort((a, b) => {
        // Trial/free first, then by price
        if (a.isTrial && !b.isTrial) return -1
        if (!a.isTrial && b.isTrial) return 1
        return a.price - b.price
      })
  }, [plansData])

  /**
   * Purpose: Executes handleSelectPlan functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // Navigate to checkout with plan ID
    router.push(`/checkout?plan_id=${plan.id}`)
  }

  if (plansLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <LottieLoader size={80} className="mx-auto" />
          <p className="mt-3 text-sm text-gray-500">{t('Loading plans...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Crown className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {t('Upgrade Your Plan')}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600">
          {t(
            'Choose the plan that best fits your needs. Upgrade anytime and unlock powerful features.'
          )}
        </p>

        {/* Current plan info */}
        {subscription?.plan && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-600">{t('Current plan:')}</span>
            <span className="font-semibold text-gray-900">
              {subscription.plan.name}
            </span>
          </div>
        )}
      </div>

      {/* Plan Cards */}
      {plans.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">{t('No plans available at this time.')}</p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 ${
              plans.length === 1
                ? 'max-w-md mx-auto'
                : plans.length === 2
                  ? 'max-w-2xl mx-auto md:grid-cols-2'
                  : plans.length === 3
                    ? 'max-w-5xl mx-auto md:grid-cols-3'
                    : 'md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.id === currentPlanId}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>

          {/* Comparison Table */}
          {plans.length > 1 && (
            <div className="mt-16">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                {t('Compare Plans')}
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <ComparisonTable plans={plans} />
              </div>
            </div>
          )}

          {/* FAQ / Additional Info */}
          <div className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t('Frequently Asked Questions')}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('Can I change plans later?')}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {t(
                    'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.'
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('What happens to my QR codes?')}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {t(
                    'Your existing QR codes will continue to work. Downgrading may limit the creation of new QR codes.'
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('Is there a free trial?')}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {t(
                    'Some plans offer a free trial period. Check the plan details above for trial availability.'
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('How do I cancel?')}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {t(
                    'You can cancel your subscription from your account settings. Your plan will remain active until the end of the current billing period.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

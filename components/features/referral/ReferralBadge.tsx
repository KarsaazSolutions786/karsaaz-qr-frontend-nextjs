'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Tier definitions
// ---------------------------------------------------------------------------

export interface TierDefinition {
  key: string
  label: string
  min: number
  max: number | null
  /** Tailwind classes for the badge background when active */
  bgClass: string
  /** Tailwind classes for text/icon when active */
  textClass: string
  /** Tailwind classes for the progress bar fill */
  barClass: string
  /** Tailwind ring class for the badge outline */
  ringClass: string
  /** Description shown in the achievements panel */
  reward: string
}

export const TIERS: TierDefinition[] = [
  {
    key: 'bronze',
    label: 'Bronze',
    min: 1,
    max: 4,
    bgClass: 'bg-amber-700',
    textClass: 'text-amber-700',
    barClass: 'bg-amber-600',
    ringClass: 'ring-amber-400',
    reward: 'Welcome to the referral program',
  },
  {
    key: 'silver',
    label: 'Silver',
    min: 5,
    max: 14,
    bgClass: 'bg-gray-400',
    textClass: 'text-gray-500',
    barClass: 'bg-gray-400',
    ringClass: 'ring-gray-300',
    reward: 'Priority support access',
  },
  {
    key: 'gold',
    label: 'Gold',
    min: 15,
    max: 49,
    bgClass: 'bg-yellow-500',
    textClass: 'text-yellow-600',
    barClass: 'bg-yellow-500',
    ringClass: 'ring-yellow-400',
    reward: 'Increased commission rate',
  },
  {
    key: 'platinum',
    label: 'Platinum',
    min: 50,
    max: null,
    bgClass: 'bg-purple-600',
    textClass: 'text-purple-600',
    barClass: 'bg-purple-600',
    ringClass: 'ring-purple-400',
    reward: 'Maximum commission & exclusive perks',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getTierForCount(count: number): TierDefinition {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const tier = TIERS[i]
    if (tier && count >= tier.min) return tier
  }
  // Below bronze threshold (0 referrals) -- show bronze as target
  return TIERS[0] as TierDefinition
}

export function getNextTier(current: TierDefinition): TierDefinition | null {
  const idx = TIERS.findIndex((t) => t.key === current.key)
  if (idx < 0 || idx >= TIERS.length - 1) return null
  return TIERS[idx + 1] ?? null
}

/** Returns progress percentage (0-100) toward the next tier, or 100 if at max. */
export function getProgress(count: number, current: TierDefinition): number {
  const next = getNextTier(current)
  if (!next) return 100 // Already at platinum
  if (count < current.min) {
    // Not yet at bronze
    return Math.round((count / current.min) * 100)
  }
  const range = next.min - current.min
  const progress = count - current.min
  return Math.min(100, Math.round((progress / range) * 100))
}

// ---------------------------------------------------------------------------
// Shield / trophy icon
// ---------------------------------------------------------------------------

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// ReferralBadge component
// ---------------------------------------------------------------------------

interface ReferralBadgeProps {
  /** Total number of referrals */
  totalReferrals: number
  /** Compact mode hides progress text, used when embedded in small spaces */
  compact?: boolean
}

export function ReferralBadge({ totalReferrals, compact = false }: ReferralBadgeProps) {
  const { t } = useTranslation()
  const tier = useMemo(() => getTierForCount(totalReferrals), [totalReferrals])
  const nextTier = useMemo(() => getNextTier(tier), [tier])
  const progress = useMemo(() => getProgress(totalReferrals, tier), [totalReferrals, tier])

  const hasStarted = totalReferrals >= 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Badge icon */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
            hasStarted ? tier.bgClass : 'bg-gray-200'
          } ring-4 ${hasStarted ? tier.ringClass : 'ring-gray-100'}`}
        >
          {hasStarted ? (
            <ShieldIcon className="h-7 w-7 text-white" />
          ) : (
            <ShieldIcon className="h-7 w-7 text-gray-400" />
          )}
        </div>

        {/* Tier text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">
              {hasStarted ? `${tier.label} ${t('Tier')}` : t('No Tier Yet')}
            </h3>
            {hasStarted && tier.key === 'platinum' && (
              <StarIcon className="h-5 w-5 text-purple-500" />
            )}
          </div>

          {!compact && (
            <p className="mt-0.5 text-sm text-gray-500">
              {hasStarted ? tier.reward : t('Make your first referral to earn Bronze')}
            </p>
          )}

          {/* Progress toward next tier */}
          {nextTier && (
            <div className="mt-3">
              {!compact && (
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">
                    {totalReferrals}/{nextTier.min} {t('referrals to')} {nextTier.label}
                  </span>
                  <span className="text-gray-400">{progress}%</span>
                </div>
              )}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${tier.barClass}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {compact && (
                <p className="mt-1 text-xs text-gray-500">
                  {totalReferrals}/{nextTier.min} {t('to')} {nextTier.label}
                </p>
              )}
            </div>
          )}

          {/* Platinum -- maxed out */}
          {!nextTier && hasStarted && (
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
              {!compact && (
                <p className="mt-1.5 text-xs font-medium text-purple-600">
                  {t('Maximum tier achieved')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

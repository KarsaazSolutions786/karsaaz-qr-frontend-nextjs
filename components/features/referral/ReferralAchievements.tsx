'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/lib/i18n'
import { TIERS, getTierForCount, type TierDefinition } from './ReferralBadge'

// ---------------------------------------------------------------------------
// Individual tier card
// ---------------------------------------------------------------------------

function TierCard({
  tier,
  isUnlocked,
  isCurrent,
}: {
  tier: TierDefinition
  isUnlocked: boolean
  isCurrent: boolean
}) {
  const { t } = useTranslation()

  return (
    <div
      className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-200 ${
        isCurrent
          ? `${tier.ringClass.replace('ring-', 'border-')} bg-white shadow-md`
          : isUnlocked
            ? 'border-gray-200 bg-white'
            : 'border-gray-100 bg-gray-50'
      }`}
    >
      {/* "Current" label */}
      {isCurrent && (
        <span
          className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${tier.bgClass}`}
        >
          {t('Current')}
        </span>
      )}

      {/* Badge circle */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isUnlocked ? tier.bgClass : 'bg-gray-200'
        }`}
      >
        {isUnlocked ? (
          <ShieldCheckIcon className="h-6 w-6 text-white" />
        ) : (
          <LockIcon className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Label */}
      <p
        className={`mt-2.5 text-sm font-bold ${
          isUnlocked ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        {tier.label}
      </p>

      {/* Threshold */}
      <p className={`text-xs ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
        {tier.max !== null
          ? `${tier.min}-${tier.max} ${t('referrals')}`
          : `${tier.min}+ ${t('referrals')}`}
      </p>

      {/* Reward description */}
      <p
        className={`mt-2 text-center text-[11px] leading-tight ${
          isUnlocked ? 'text-gray-600' : 'text-gray-400'
        }`}
      >
        {tier.reward}
      </p>

      {/* Checkmark for completed tiers (unlocked but not current) */}
      {isUnlocked && !isCurrent && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
          <CheckIcon className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connector line between tiers
// ---------------------------------------------------------------------------

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="hidden flex-1 items-center sm:flex">
      <div
        className={`h-0.5 w-full ${filled ? 'bg-green-400' : 'bg-gray-200'}`}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function ShieldCheckIcon({ className }: { className?: string }) {
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

function LockIcon({ className }: { className?: string }) {
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
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// ReferralAchievements component
// ---------------------------------------------------------------------------

interface ReferralAchievementsProps {
  totalReferrals: number
}

export function ReferralAchievements({ totalReferrals }: ReferralAchievementsProps) {
  const { t } = useTranslation()
  const currentTier = useMemo(() => getTierForCount(totalReferrals), [totalReferrals])

  const currentTierIndex = TIERS.findIndex((ti) => ti.key === currentTier.key)
  const hasStarted = totalReferrals >= 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{t('Achievement Tiers')}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {t('Unlock higher tiers by growing your referral network.')}
      </p>

      {/* Tier cards with connectors */}
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-0">
        {TIERS.map((tier, idx) => {
          const isUnlocked = hasStarted && totalReferrals >= tier.min
          const isCurrent = hasStarted && tier.key === currentTier.key

          return (
            <div
              key={tier.key}
              className="flex flex-1 items-center"
            >
              <div className="flex-1">
                <TierCard
                  tier={tier}
                  isUnlocked={isUnlocked}
                  isCurrent={isCurrent}
                />
              </div>
              {idx < TIERS.length - 1 && (
                <Connector filled={hasStarted && idx < currentTierIndex} />
              )}
            </div>
          )
        })}
      </div>

      {/* Motivational callout */}
      {(() => {
        const nextTier = currentTierIndex < TIERS.length - 1
          ? TIERS[currentTierIndex + 1]
          : undefined

        if (!hasStarted) {
          return (
            <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {t('Share your referral link to earn your first badge and start climbing the tiers.')}
            </div>
          )
        }

        if (nextTier) {
          const remaining = nextTier.min - totalReferrals
          return (
            <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {remaining} {remaining === 1 ? t('more referral') : t('more referrals')} {t('to reach')}{' '}
              <span className="font-semibold">{nextTier.label}</span> {t('tier.')}{' '}
              {t('Keep sharing!')}
            </div>
          )
        }

        return (
          <div className="mt-5 rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-700">
            {t('Congratulations! You have reached the highest tier. Thank you for being an outstanding ambassador.')}
          </div>
        )
      })()}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/i18n'
import { useSubscription } from '@/lib/hooks/useSubscription'

/**
 * Purpose: Dashboard banner showing subscription status warnings. States: - Expired: red banner prompting upgrade - Expiring within 7 days: amber banner prompting renewal - Trial: blue banner showing days left - No plan / free (no subscription): subtle gray banner - Active (healthy): hidden Dismissible per session via local state.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function SubscriptionBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const { status, remainingDays, plan, isLoading } = useSubscription()

  if (dismissed || isLoading) return null

  // Determine banner variant based on subscription status
  let variant: 'red' | 'amber' | 'blue' | 'gray' | null = null
  let message = ''
  let actionLabel = ''

  switch (status) {
    case 'expired':
    case 'trial_expired':
      variant = 'red'
      message = t('Your subscription has expired. Upgrade to continue creating QR codes.')
      actionLabel = t('View Plans')
      break
    case 'expiring_soon':
      variant = 'amber'
      message = `${t('Your subscription expires in')} ${remainingDays} ${t('day(s)')}. ${t('Renew now to avoid interruption.')}`
      actionLabel = t('Renew')
      break
    case 'trial_expiring_soon':
      variant = 'amber'
      message = `${t('Your free trial expires in')} ${remainingDays} ${t('day(s)')}. ${t('Upgrade for full access.')}`
      actionLabel = t('Upgrade')
      break
    case 'trial':
      variant = 'blue'
      message = `${t("You're on a free trial")} (${remainingDays} ${t('day(s) left')}). ${t('Upgrade for full access.')}`
      actionLabel = t('Upgrade')
      break
    case 'active':
      // If active with a plan, no banner needed
      if (plan) return null
      // No plan at all (free user)
      variant = 'gray'
      message = t("You're on the free plan. Upgrade for more QR codes and features.")
      actionLabel = t('See Plans')
      break
    default:
      return null
  }

  if (!variant) return null

  const colorMap = {
    red: {
      bg: 'bg-red-600',
      text: 'text-white',
      button: 'bg-white text-red-700 hover:bg-red-50',
      close: 'text-red-200 hover:text-white',
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-white',
      button: 'bg-white text-amber-700 hover:bg-amber-50',
      close: 'text-amber-200 hover:text-white',
    },
    blue: {
      bg: 'bg-blue-600',
      text: 'text-white',
      button: 'bg-white text-blue-700 hover:bg-blue-50',
      close: 'text-blue-200 hover:text-white',
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      button: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500',
      close: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200',
    },
  }

  const colors = colorMap[variant]

  return (
    <div className={`${colors.bg} ${colors.text} px-4 py-2 text-sm z-40`}>
      <div className="flex items-center justify-center gap-3">
        <span className="font-medium">{message}</span>
        <Link
          href="/pricing"
          className={`shrink-0 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${colors.button}`}
        >
          {actionLabel}
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={`shrink-0 ml-1 p-0.5 rounded transition-colors ${colors.close}`}
          aria-label={t('Dismiss banner')}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

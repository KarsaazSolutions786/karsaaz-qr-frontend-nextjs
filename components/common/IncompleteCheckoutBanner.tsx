'use client'

import Link from 'next/link'
import { ShoppingCart, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useCheckoutEnforcement } from '@/lib/hooks/useCheckoutEnforcement'

/**
 * Purpose: Persistent banner shown when a user has started checkout but did not complete it. Displays a "Complete Your Purchase" message with a link to resume. Dismissible per session. Auto-hides after the user completes checkout (enforcement result changes). Matches P1 CheckoutNotCompletedEnforcer behavior, adapted to a React banner.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function IncompleteCheckoutBanner() {
  const { t } = useTranslation()
  const {
    hasIncompleteCheckout,
    resumeUrl,
    isDismissed,
    dismiss,
    pendingPlanName,
    reason,
  } = useCheckoutEnforcement()

  // Only show for checkout-not-completed, not for no-plan (that is handled by SubscriptionBanner)
  if (!hasIncompleteCheckout || isDismissed || reason !== 'checkout-not-completed') {
    return null
  }

  const targetUrl = resumeUrl ?? '/pricing'

  return (
    <div className="bg-indigo-600 text-white px-4 py-2 text-sm z-40">
      <div className="flex items-center justify-center gap-3">
        <ShoppingCart className="h-4 w-4 shrink-0" />
        <span className="font-medium">
          {pendingPlanName
            ? `${t('Complete your')} ${pendingPlanName} ${t('purchase to activate your plan.')}`
            : t('You have an incomplete purchase. Complete checkout to activate your plan.')}
        </span>
        <Link
          href={targetUrl}
          className="shrink-0 rounded-md bg-white px-3 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
        >
          {t('Complete Purchase')}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 ml-1 p-0.5 rounded transition-colors text-indigo-200 hover:text-white"
          aria-label={t('Dismiss banner')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

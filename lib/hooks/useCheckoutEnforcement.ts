'use client'

import { useMemo, useState, useCallback } from 'react'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useAuth } from '@/lib/context/AuthContext'
import {
  checkoutEnforcement,
  type UserContext,
  type SubscriptionContext,
} from '@/lib/services/checkout-enforcement'

interface CheckoutEnforcementResult {
  /** Whether an incomplete checkout was detected */
  hasIncompleteCheckout: boolean
  /** The URL to resume checkout (e.g., /checkout or /plans) */
  resumeUrl: string | null
  /** The reason for enforcement (enforcer name) */
  reason: string | null
  /** Whether the banner/modal has been dismissed */
  isDismissed: boolean
  /** Dismiss the incomplete checkout banner for this session */
  dismiss: () => void
  /** Reset dismissal (e.g., after user navigates to checkout) */
  resetDismissal: () => void
  /** The plan name the user was trying to subscribe to (if available) */
  pendingPlanName: string | null
}

const DISMISS_KEY = 'checkout-enforcement-dismissed'
export function useCheckoutEnforcement(): CheckoutEnforcementResult {
  const { user } = useAuth()
  const { status, plan, subscription } = useSubscription()

  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(DISMISS_KEY) === 'true'
  })

  const enforcementResult = useMemo(() => {
    if (!user) {
      return { shouldRedirect: false, redirectUrl: null, reason: undefined }
    }

    const userContext: UserContext = {
      id: user.id,
      subscriptionStatus: status,
      subscriptions: (user.subscriptions as Array<Record<string, unknown>>) ?? [],
      roles: user.roles as Array<{ name: string; super_admin?: boolean | number }> | undefined,
    }
    const isCheckoutCompleted = status === 'active' || status === 'trial' ||
      status === 'expiring_soon' || status === 'trial_expiring_soon'

    const subscriptionContext: SubscriptionContext = {
      status,
      plan,
      checkoutCompleted: isCheckoutCompleted,
    }

    return checkoutEnforcement.enforce(userContext, subscriptionContext)
  }, [user, status, plan])

  const pendingPlanName = useMemo(() => {
    if (!enforcementResult.shouldRedirect) return null
    if (subscription?.subscription_plan) {
      return (subscription.subscription_plan as any)?.name ?? null
    }
    return null
  }, [enforcementResult.shouldRedirect, subscription])

  const dismiss = useCallback(() => {
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DISMISS_KEY, 'true')
    }
  }, [])

  const resetDismissal = useCallback(() => {
    setIsDismissed(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DISMISS_KEY)
    }
  }, [])

  return {
    hasIncompleteCheckout: enforcementResult.shouldRedirect,
    resumeUrl: enforcementResult.redirectUrl ?? null,
    reason: enforcementResult.reason ?? null,
    isDismissed,
    dismiss,
    resetDismissal,
    pendingPlanName,
  }
}

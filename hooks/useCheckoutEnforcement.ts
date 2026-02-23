'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { isCustomer, isSubUser, isSuperAdmin } from '@/lib/utils/permissions'
import {
  checkoutEnforcement,
  type UserContext,
  type SubscriptionContext,
} from '@/lib/services/checkout-enforcement'
import { useSubscriptionStore } from '@/lib/services/subscription-service'

/**
 * Routes that require an active subscription for customers.
 * Based on original checkout_enforce_on_routes config.
 */
const SUBSCRIPTION_REQUIRED_ROUTES = ['/qrcodes', '/folders', '/analytics', '/dashboard']

/** Pages where enforcement is skipped entirely */
const EXEMPT_PAGES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/pricing',
  '/plans',
  '/checkout',
  '/p/', // public QR pages
  '/verify',
]

/**
 * Check if user has an active paid subscription.
 * Returns true if:
 * - User has subscriptionStatus 'active' or 'trial'
 * - OR user has at least one subscription in subscriptions array with active/trial status
 */
function hasActiveSubscription(user: ReturnType<typeof useAuth>['user']): boolean {
  if (!user) return false

  // Check subscriptionStatus field
  const status = user.subscriptionStatus
  if (status === 'active' || status === 'trial') {
    return true
  }

  // Check subscriptions array
  const subscriptions = user.subscriptions
  if (Array.isArray(subscriptions) && subscriptions.length > 0) {
    return subscriptions.some(sub => sub.status === 'active' || sub.status === 'trial')
  }

  return false
}

interface UseCheckoutEnforcementOptions {
  /** Override the list of routes requiring subscription */
  routes?: string[]
  /** URL to redirect to when checkout is required (default: /pricing) */
  redirectTo?: string
  /** Enable/disable the hook (useful for conditional enforcement) */
  enabled?: boolean
}

/**
 * useCheckoutEnforcement - Enforce subscription checkout for customers.
 *
 * Enhanced with CheckoutEnforcementManager (Phase 14):
 * - Uses the service-layer enforcer chain for structured redirect logic
 * - Falls back to legacy route-matching behavior for backward compatibility
 *
 * Exemptions:
 * - Super admins (bypass all restrictions)
 * - Sub-users (inherit from parent)
 * - Non-customers (other roles like Admin)
 * - Auth/public pages (login, register, pricing, etc.)
 *
 * Usage:
 *   const { isEnforcing, redirectUrl } = useCheckoutEnforcement()
 */
export function useCheckoutEnforcement(options: UseCheckoutEnforcementOptions = {}) {
  const { routes = SUBSCRIPTION_REQUIRED_ROUTES, redirectTo = '/pricing', enabled = true } = options

  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const subscriptionStore = useSubscriptionStore()

  // Check if current page is exempt from enforcement
  const isExemptPage = useMemo(
    () => EXEMPT_PAGES.some(page => pathname.startsWith(page)),
    [pathname]
  )

  // Build service-layer contexts from current user/subscription state
  const enforcementResult = useMemo(() => {
    if (!enabled || isLoading || !user || isExemptPage) return null

    // Super admins, sub-users, and non-customers bypass enforcement
    if (isSuperAdmin(user) || isSubUser(user) || !isCustomer(user)) return null

    // Check if current route requires subscription (legacy check)
    const requiresSubscription = routes.some(
      route => pathname.startsWith(route) || pathname === route
    )
    if (!requiresSubscription) return null

    // Build contexts for the enforcement manager
    const userCtx: UserContext = {
      id: user.id,
      subscriptionStatus: user.subscriptionStatus,
      subscriptions: user.subscriptions,
      roles: user.roles,
    }

    const subCtx: SubscriptionContext = {
      status: subscriptionStore.status,
      plan: subscriptionStore.plan,
      checkoutCompleted: subscriptionStore.status !== 'expired',
    }

    return checkoutEnforcement.enforce(userCtx, subCtx)
  }, [
    user,
    isLoading,
    pathname,
    subscriptionStore.status,
    subscriptionStore.plan,
    enabled,
    routes,
    isExemptPage,
  ])

  // Perform redirect when enforcement triggers
  useEffect(() => {
    if (!enforcementResult) return

    if (enforcementResult.shouldRedirect && enforcementResult.redirectUrl) {
      // Store intended destination for after checkout
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_redirect', pathname)
      }
      router.push(enforcementResult.redirectUrl)
      return
    }

    // Legacy fallback: redirect to pricing if no active subscription
    if (!hasActiveSubscription(user)) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_redirect', pathname)
      }
      router.push(redirectTo)
    }
  }, [enforcementResult, user, pathname, router, redirectTo])

  const isEnforcing = !!enforcementResult?.shouldRedirect
  const redirectUrl = enforcementResult?.redirectUrl ?? null

  return {
    /** Whether enforcement is actively redirecting the user */
    isEnforcing,
    /** The URL the user is being redirected to, or null */
    redirectUrl,
    /** Whether checkout is required for current user/route */
    checkoutRequired:
      !isLoading && user && isCustomer(user) && !isSuperAdmin(user) && !hasActiveSubscription(user),
    /** Whether the hook is still loading */
    isLoading,
    /** Whether user has active subscription */
    hasSubscription: user ? hasActiveSubscription(user) : false,
  }
}

export default useCheckoutEnforcement

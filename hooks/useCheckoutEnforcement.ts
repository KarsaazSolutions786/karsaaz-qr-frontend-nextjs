'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { isCustomer, isSubUser, isSuperAdmin } from '@/lib/utils/permissions'

/**
 * Routes that require an active subscription for customers.
 * Based on original checkout_enforce_on_routes config.
 */
const SUBSCRIPTION_REQUIRED_ROUTES = [
  '/qrcodes',
  '/folders',
  '/analytics',
  '/dashboard',
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
    return subscriptions.some(
      (sub) => sub.status === 'active' || sub.status === 'trial'
    )
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
 * Matches original checkout enforcement behavior:
 * - Customers (Client role) on protected dashboard routes
 * - Without an active subscription
 * - Are redirected to the pricing/checkout page
 * 
 * Exemptions:
 * - Super admins (bypass all restrictions)
 * - Sub-users (inherit from parent)
 * - Non-customers (other roles like Admin)
 * 
 * Usage:
 *   useCheckoutEnforcement() // in a dashboard layout
 */
export function useCheckoutEnforcement(options: UseCheckoutEnforcementOptions = {}) {
  const {
    routes = SUBSCRIPTION_REQUIRED_ROUTES,
    redirectTo = '/pricing',
    enabled = true,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!enabled || isLoading || !user) return

    // Super admins bypass all restrictions
    if (isSuperAdmin(user)) return

    // Sub-users inherit from parent, don't enforce on them directly
    if (isSubUser(user)) return

    // Only enforce on customers (Client role)
    if (!isCustomer(user)) return

    // Check if current route requires subscription
    const requiresSubscription = routes.some((route) =>
      pathname.startsWith(route) || pathname === route
    )

    if (!requiresSubscription) return

    // Check if user has active subscription
    if (!hasActiveSubscription(user)) {
      // Store intended destination for after checkout
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkout_redirect', pathname)
      }
      router.push(redirectTo)
    }
  }, [user, isLoading, pathname, router, routes, redirectTo, enabled])

  return {
    /** Whether checkout is required for current user/route */
    checkoutRequired: !isLoading && user && isCustomer(user) && !isSuperAdmin(user) && !hasActiveSubscription(user),
    /** Whether the hook is still loading */
    isLoading,
    /** Whether user has active subscription */
    hasSubscription: user ? hasActiveSubscription(user) : false,
  }
}

export default useCheckoutEnforcement

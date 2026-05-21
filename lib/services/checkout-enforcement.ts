// Checkout Enforcement Service (T317 - Phase 14)
// Manages checkout/subscription enforcement rules using chain-of-responsibility pattern
// Singleton pattern per project conventions

export interface UserContext {
  id: string | number
  subscriptionStatus?: string
  subscriptions?: Array<Record<string, unknown>>
  roles?: Array<{ name: string; super_admin?: boolean | number }>
}

export interface SubscriptionContext {
  status: string
  plan: unknown | null
  checkoutCompleted: boolean
}

export interface EnforcementResult {
  shouldRedirect: boolean
  redirectUrl: string | null
  reason?: string
}

/** Interface for individual enforcement rules */
export interface CheckoutEnforcer {
  /** Unique name for this enforcer */
  name: string
  /** Determine if this enforcer should trigger a redirect */
  shouldEnforce(user: UserContext, subscription: SubscriptionContext): boolean
  /** Get the redirect URL when enforcement triggers */
  getRedirectUrl(): string
}

/**
 * Purpose: * Redirects to /checkout if subscription checkout is incomplete 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

class CheckoutNotCompletedEnforcer implements CheckoutEnforcer {
  name = 'checkout-not-completed'

  /**
   * Purpose: Executes shouldEnforce functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  shouldEnforce(_user: UserContext, subscription: SubscriptionContext): boolean {
    // Enforce if user has a subscription but checkout was not completed
    if (!subscription.plan) return false
    return !subscription.checkoutCompleted
  }

  /**
   * Purpose: Retrieves redirecturl.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  getRedirectUrl(): string {
    return '/checkout'
  }
}

/**
 * Purpose: * Redirects to /plans if user has no active plan 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

class NoPlanEnforcer implements CheckoutEnforcer {
  name = 'no-plan'

  /**
   * Purpose: Executes shouldEnforce functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  shouldEnforce(user: UserContext, subscription: SubscriptionContext): boolean {
    // Don't enforce if user already has an active plan
    const activeStatuses = ['active', 'trial']
    if (activeStatuses.includes(subscription.status)) return false

    // Check user's subscription status
    if (user.subscriptionStatus && activeStatuses.includes(user.subscriptionStatus)) return false

    // Check subscriptions array
    if (Array.isArray(user.subscriptions) && user.subscriptions.length > 0) {
      const hasActive = user.subscriptions.some(sub => {
        const status = sub.status as string | undefined
        if (status && activeStatuses.includes(status)) return true
        const statuses = sub.statuses as Array<{ status: string }> | undefined
        return statuses?.some(s => activeStatuses.includes(s.status)) ?? false
      })
      if (hasActive) return false
    }

    return true
  }

  /**
   * Purpose: Retrieves redirecturl.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  getRedirectUrl(): string {
    return '/plans'
  }
}

/**
 * Purpose: * Manages a chain of enforcers, runs them in order, returns first redirect or null 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

class CheckoutEnforcementManager {
  private static instance: CheckoutEnforcementManager
  private enforcers: CheckoutEnforcer[] = []

  /**
   * Purpose: Retrieves instance.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getInstance(): CheckoutEnforcementManager {
    if (!this.instance) this.instance = new CheckoutEnforcementManager()
    return this.instance
  }

  /**
   * Purpose: * Register an enforcer to the chain 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  addEnforcer(enforcer: CheckoutEnforcer): void {
    this.enforcers.push(enforcer)
  }

  /**
   * Purpose: * Remove an enforcer by name 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  removeEnforcer(name: string): void {
    this.enforcers = this.enforcers.filter(e => e.name !== name)
  }

  /**
   * Purpose: * Run all enforcers in order, return first enforcement result or null 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  enforce(user: UserContext, subscription: SubscriptionContext): EnforcementResult {
    // Super admins bypass all enforcement
    if (this.isSuperAdmin(user)) {
      return { shouldRedirect: false, redirectUrl: null }
    }

    for (const enforcer of this.enforcers) {
      if (enforcer.shouldEnforce(user, subscription)) {
        return {
          shouldRedirect: true,
          redirectUrl: enforcer.getRedirectUrl(),
          reason: enforcer.name,
        }
      }
    }

    return { shouldRedirect: false, redirectUrl: null }
  }

  /**
   * Purpose: * Get all registered enforcers 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  getEnforcers(): CheckoutEnforcer[] {
    return [...this.enforcers]
  }

  /**
   * Purpose: Checks if superadmin.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  private isSuperAdmin(user: UserContext): boolean {
    return Array.isArray(user.roles) && user.roles.some(r => !!r.super_admin)
  }
}

// Create and configure singleton with default enforcers
const checkoutEnforcement = CheckoutEnforcementManager.getInstance()
checkoutEnforcement.addEnforcer(new CheckoutNotCompletedEnforcer())
checkoutEnforcement.addEnforcer(new NoPlanEnforcer())

export {
  CheckoutNotCompletedEnforcer,
  NoPlanEnforcer,
  CheckoutEnforcementManager,
  checkoutEnforcement,
}

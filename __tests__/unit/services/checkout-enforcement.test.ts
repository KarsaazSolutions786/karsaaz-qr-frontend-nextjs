import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { UserContext, SubscriptionContext } from '@/lib/services/checkout-enforcement'

let CheckoutEnforcementManager: typeof import('@/lib/services/checkout-enforcement').CheckoutEnforcementManager

describe('checkout-enforcement', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('@/lib/services/checkout-enforcement')
    CheckoutEnforcementManager = mod.CheckoutEnforcementManager
  })

  const baseUser: UserContext = { id: 1, roles: [] }
  const activeSub: SubscriptionContext = { status: 'active', plan: 'pro', checkoutCompleted: true }

  it('returns no redirect for active subscription', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const result = manager.enforce(baseUser, activeSub)
    expect(result.shouldRedirect).toBe(false)
  })

  it('redirects to /checkout when checkout not completed', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const sub: SubscriptionContext = { status: 'pending', plan: 'pro', checkoutCompleted: false }
    const result = manager.enforce(baseUser, sub)
    expect(result.shouldRedirect).toBe(true)
    expect(result.redirectUrl).toBe('/checkout')
    expect(result.reason).toBe('checkout-not-completed')
  })

  it('redirects to /plans when no active plan', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const sub: SubscriptionContext = { status: 'expired', plan: null, checkoutCompleted: true }
    const result = manager.enforce(baseUser, sub)
    expect(result.shouldRedirect).toBe(true)
    expect(result.redirectUrl).toBe('/plans')
    expect(result.reason).toBe('no-plan')
  })

  it('super admin bypasses all enforcement', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const superAdmin: UserContext = { id: 1, roles: [{ name: 'admin', super_admin: true }] }
    const sub: SubscriptionContext = { status: 'expired', plan: null, checkoutCompleted: false }
    const result = manager.enforce(superAdmin, sub)
    expect(result.shouldRedirect).toBe(false)
  })

  it('user with active subscriptions array is not redirected', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const user: UserContext = {
      id: 1,
      roles: [],
      subscriptions: [{ status: 'active' }],
    }
    const sub: SubscriptionContext = { status: 'expired', plan: null, checkoutCompleted: true }
    const result = manager.enforce(user, sub)
    expect(result.shouldRedirect).toBe(false)
  })

  it('allows adding and removing custom enforcers', () => {
    const manager = CheckoutEnforcementManager.getInstance()
    const custom = {
      name: 'custom-test',
      shouldEnforce: () => true,
      getRedirectUrl: () => '/custom',
    }
    manager.addEnforcer(custom)
    expect(manager.getEnforcers().some(e => e.name === 'custom-test')).toBe(true)
    manager.removeEnforcer('custom-test')
    expect(manager.getEnforcers().some(e => e.name === 'custom-test')).toBe(false)
  })
})

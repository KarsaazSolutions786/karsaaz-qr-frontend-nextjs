'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccountCreditStore } from '@/lib/store/account-credit-store'
import { accountCreditsAPI } from '@/lib/api/endpoints/account-credits'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'
import { useAuth } from '@/lib/context/AuthContext'
import { queryKeys } from '@/lib/query/keys'

/**
 * Billing config keys that determine credit-mode status and pricing.
 * These are the same keys the Laravel HeadConfigsComposer exposes.
 */
const BILLING_CONFIG_KEYS = [
  'billing.mode',
  'account_credit.dynamic_qrcode_price',
  'account_credit.static_qrcode_price',
]

export function useAccountCredit() {
  const { user } = useAuth()
  const store = useAccountCreditStore()

  // ── Fetch billing config from system configs API (cached 5 min) ──
  // Disabled when no user is authenticated (guest mode) — requires auth
  const { data: billingConfigs } = useQuery({
    queryKey: queryKeys.systemConfigs.byKeys(BILLING_CONFIG_KEYS),
    queryFn: async () => {
      const configs = await systemConfigsAPI.get(BILLING_CONFIG_KEYS)
      const map: Record<string, string> = {}
      for (const cfg of configs) {
        map[cfg.key] = cfg.value ?? ''
      }
      return map
    },
    enabled: !!user,
    staleTime: 5 * 60_000, // 5 minutes -- billing config rarely changes
    gcTime: 10 * 60_000,
    retry: 1,
  })

  // ── Derived billing state ──
  const isAccountCreditMode = billingConfigs?.['billing.mode'] === 'account_credit'
  const dynamicQRPrice = Number(billingConfigs?.['account_credit.dynamic_qrcode_price'] ?? 0)
  const staticQRPrice = Number(billingConfigs?.['account_credit.static_qrcode_price'] ?? 0)

  // ── Balance from user object (set by /myself) or from store ──
  // The /myself endpoint already returns account_balance when credit mode is active.
  // We also keep the store as a secondary source that can be refreshed independently.
  const balance = useMemo(() => {
    if (isAccountCreditMode && typeof user?.account_balance === 'number') {
      return user.account_balance
    }
    return store.balance
  }, [isAccountCreditMode, user?.account_balance, store.balance])

  // Sync store when user balance changes (so cart computations stay accurate)
  useEffect(() => {
    if (isAccountCreditMode && typeof user?.account_balance === 'number' && store.balance !== user.account_balance) {
      store.setBalance(user.account_balance)
    }
  }, [isAccountCreditMode, user?.account_balance, store])

  const refreshBalance = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await accountCreditsAPI.getBalance(user.id)
      store.setBalance(data.account_balance ?? 0)
    } catch {
      if (process.env.NODE_ENV === 'development') console.error('Failed to refresh account balance')
    }
  }, [user?.id, store])

  /**
   * Check if the user can afford to create a QR code of the given type.
   * @param isDynamic - whether the QR type is dynamic (true) or static (false)
   */
  const canAfford = useCallback(
    (isDynamic: boolean): boolean => {
      if (!isAccountCreditMode) return true // not in credit mode, no credit check
      const price = isDynamic ? dynamicQRPrice : staticQRPrice
      if (price <= 0) return true // free
      return balance >= price
    },
    [isAccountCreditMode, dynamicQRPrice, staticQRPrice, balance]
  )

  /**
   * Get the price for a given QR type.
   */
  const getPrice = useCallback(
    (isDynamic: boolean): number => {
      return isDynamic ? dynamicQRPrice : staticQRPrice
    },
    [dynamicQRPrice, staticQRPrice]
  )

  return {
    // Billing mode
    isAccountCreditMode,
    dynamicQRPrice,
    staticQRPrice,

    // Balance
    balance,
    refreshBalance,

    // Affordability
    canAfford,
    getPrice,

    // Cart (pass-through from store)
    cartItems: store.cartItems,
    cartTotal: store.cartTotal(),
    amountToPay: store.amountToPay(),
    numberOfItems: store.numberOfItems(),
    hasItems: store.hasItems(),
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}

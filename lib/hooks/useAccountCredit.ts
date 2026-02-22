'use client'

import { useCallback } from 'react'
import { useAccountCreditStore } from '@/lib/store/account-credit-store'
import { accountCreditsAPI } from '@/lib/api/endpoints/account-credits'
import { useAuth } from '@/lib/context/AuthContext'

export function useAccountCredit() {
  const { user } = useAuth()
  const store = useAccountCreditStore()

  const refreshBalance = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await accountCreditsAPI.getBalance(user.id)
      store.setBalance(data.account_balance ?? 0)
    } catch {
      console.error('Failed to refresh account balance')
    }
  }, [user?.id, store])

  return {
    balance: store.balance,
    cartItems: store.cartItems,
    cartTotal: store.cartTotal(),
    amountToPay: store.amountToPay(),
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    refreshBalance,
  }
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  QrCode,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Wallet,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { useAccountCreditStore } from '@/lib/store/account-credit-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Purpose: Full cart page for account credit purchases. Matches P1's QrcgAccountCreditCartView with: - Item list with quantity controls (+/- buttons) - Per-item subtotal display - Remove item action - Totals section: Subtotal, Available Credit, Amount to Pay - Checkout/Pay button - Empty cart state Route: /account-credit-cart (dashboard)
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export default function AccountCreditCartPage() {
  const { t } = useTranslation()
  const {
    balance,
    cartItems,
    cartTotal,
    amountToPay,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useAccountCredit()

  const numberOfItems = useAccountCreditStore((s) => s.numberOfItems())
  const [checkingOut, setCheckingOut] = useState(false)

  /**
   * Purpose: Executes handleCheckout functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      // The checkout flow depends on the payment processor configured.
      // For now, redirect to the account-credits page where PayPal checkout is available.
      // In a future iteration, this could call generatePayLink directly.
      window.location.href = '/account-credits'
    } catch {
      setCheckingOut(false)
    }
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {t('Your cart is empty')}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {t('You do not have any items in your shopping cart.')}
          </p>
          <Button asChild className="mt-6">
            <Link href="/qrcodes/new">
              {t('Create QR Code')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/account-credits"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('Shopping Cart')}
            </h1>
            <p className="text-sm text-gray-500">
              {numberOfItems} {numberOfItems === 1 ? t('item') : t('items')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={clearCart}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          {t('Clear All')}
        </Button>
      </div>

      {/* Cart Items */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <div key={item.type} className="flex items-center gap-4 px-5 py-4">
              {/* QR Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  item.isDynamic
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-purple-50 text-purple-600'
                }`}
              >
                <QrCode className="h-6 w-6" />
              </div>

              {/* Name & price */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <Badge
                    variant={item.isDynamic ? 'default' : 'secondary'}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {item.isDynamic ? t('Dynamic') : t('Static')}
                  </Badge>
                  <span>${item.unitPrice.toFixed(2)} {t('per item')}</span>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.type, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                  aria-label={t('Decrease quantity')}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.type, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
                  aria-label={t('Increase quantity')}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="w-24 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.type)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={t('Remove item')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 rounded-b-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('Subtotal')}</span>
              <span className="font-medium text-gray-900">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Wallet className="h-4 w-4 text-green-500" />
                {t('Available Credit')}
              </span>
              <span className={`font-medium ${balance > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                -${Math.min(balance, cartTotal).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  {t('Amount to Pay')}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${amountToPay.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? t('Processing...') : amountToPay > 0
              ? `${t('Pay')} $${amountToPay.toFixed(2)}`
              : t('Complete Order')}
          </Button>

          {balance >= cartTotal && (
            <p className="mt-2 text-center text-xs text-green-600">
              {t('Your account balance covers this purchase. No payment required.')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

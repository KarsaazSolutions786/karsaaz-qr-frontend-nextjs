'use client'

import { useState } from 'react'
import { Plan } from '@/types/entities/subscription'
import { PromoCodeInput } from './PromoCodeInput'
import { useSubscribe } from '@/lib/hooks/mutations/useSubscribe'
import { useTranslation } from '@/lib/i18n'

interface StripeCheckoutFormProps {
  plan: Plan
}

/**
 * Purpose: Executes StripeCheckoutForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function StripeCheckoutForm({ plan }: StripeCheckoutFormProps) {
  const { t } = useTranslation()
  const [_promoCode, setPromoCode] = useState<string>()
  const [discountedPrice, setDiscountedPrice] = useState<number>()
  const subscribe = useSubscribe()

  const finalPrice = discountedPrice ?? plan.price

  /**
   * Purpose: Executes handlePromoApplied functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handlePromoApplied = (code: string, newPrice: number) => {
    setPromoCode(code)
    setDiscountedPrice(newPrice)
  }

  /**
   * Purpose: Executes handlePromoRemoved functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handlePromoRemoved = () => {
    setPromoCode(undefined)
    setDiscountedPrice(undefined)
  }

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await subscribe.mutateAsync({
      subscription_plan_id: plan.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t('Payment Information')}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {t('Enter your payment details below. Your subscription will start immediately.')}
        </p>
      </div>

      {/* Stripe Elements would go here in real implementation */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-center text-sm text-gray-600">
          {t('💳 Stripe payment form would appear here')}
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          {t('(Stripe Elements SDK integration required)')}
        </p>
      </div>

      {/* Promo Code */}
      <div>
        <PromoCodeInput
          planId={plan.id}
          onPromoApplied={handlePromoApplied}
          onPromoRemoved={handlePromoRemoved}
        />
      </div>

      {/* Price Summary */}
      {discountedPrice && (
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('Original Price')}</span>
            <span className="text-gray-600 line-through">
              ${Number(plan.price).toFixed(2)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-lg font-semibold">
            <span className="text-green-800">{t('Discounted Price')}</span>
            <span className="text-green-800">
              ${Number(discountedPrice).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={subscribe.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {subscribe.isPending ? t('Processing...') : `${t('Subscribe for')} $${Number(finalPrice).toFixed(2)}`}
      </button>

      <p className="text-center text-xs text-gray-500">
        {t('By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel at any time.')}
      </p>
    </form>
  )
}

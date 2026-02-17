'use client'

import { useState } from 'react'
import { Plan } from '@/types/entities/subscription'
import { PromoCodeInput } from './PromoCodeInput'
import { useSubscribe } from '@/lib/hooks/mutations/useSubscribe'

interface StripeCheckoutFormProps {
  plan: Plan
}

export function StripeCheckoutForm({ plan }: StripeCheckoutFormProps) {
  const [promoCode, setPromoCode] = useState<string>()
  const [discountedPrice, setDiscountedPrice] = useState<number>()
  const subscribe = useSubscribe()

  const finalPrice = discountedPrice ?? plan.price

  const handlePromoApplied = (code: string, newPrice: number) => {
    setPromoCode(code)
    setDiscountedPrice(newPrice)
  }

  const handlePromoRemoved = () => {
    setPromoCode(undefined)
    setDiscountedPrice(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In real implementation, this would collect payment method via Stripe Elements
    // For now, just call the subscribe mutation
    await subscribe.mutateAsync({
      planId: plan.id,
      promoCode,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your payment details below. Your subscription will start immediately.
        </p>
      </div>

      {/* Stripe Elements would go here in real implementation */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-center text-sm text-gray-600">
          💳 Stripe payment form would appear here
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          (Stripe Elements SDK integration required)
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
            <span className="text-gray-600">Original Price</span>
            <span className="text-gray-600 line-through">
              ${(plan.price / 100).toFixed(2)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-lg font-semibold">
            <span className="text-green-800">Discounted Price</span>
            <span className="text-green-800">
              ${(discountedPrice / 100).toFixed(2)}
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
        {subscribe.isPending ? 'Processing...' : `Subscribe for $${(finalPrice / 100).toFixed(2)}/month`}
      </button>

      <p className="text-center text-xs text-gray-500">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
        You can cancel at any time.
      </p>
    </form>
  )
}

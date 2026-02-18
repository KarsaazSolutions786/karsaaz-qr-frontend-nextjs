'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { StripeCheckoutForm } from '@/components/features/subscriptions/StripeCheckoutForm'
import { mapSubscriptionPlanToPlan } from '@/lib/utils/plan-mapper'
import Link from 'next/link'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  
  const { data: plansData, isLoading } = usePlans()
  const rawPlan = plansData?.data?.find((p) => p.id === Number(planId))
  const selectedPlan = rawPlan ? mapSubscriptionPlanToPlan(rawPlan) : undefined

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!planId || !selectedPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Plan</h2>
          <p className="mt-2 text-gray-600">Please select a plan to continue.</p>
          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            View Pricing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="mt-2 text-gray-600">
            You're subscribing to the <strong>{selectedPlan.name}</strong> plan
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Plan</dt>
                  <dd className="text-sm font-medium text-gray-900">{selectedPlan.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Billing</dt>
                  <dd className="text-sm font-medium text-gray-900">Monthly</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-base font-semibold text-gray-900">Total</dt>
                  <dd className="text-base font-semibold text-gray-900">
                    ${(selectedPlan.price / 100).toFixed(2)}/month
                  </dd>
                </div>
              </dl>

              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <p>✓ Cancel anytime</p>
                <p>✓ Secure payment via Stripe</p>
                <p>✓ Instant access</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <StripeCheckoutForm plan={selectedPlan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

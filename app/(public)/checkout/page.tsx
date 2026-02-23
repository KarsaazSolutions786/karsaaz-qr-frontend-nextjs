'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { StripeCheckoutForm } from '@/components/features/subscriptions/StripeCheckoutForm'
import { PayPalButton } from '@/components/features/payment/PayPalButton'
import { BillingAddressForm, DEFAULT_BILLING_ADDRESS, type BillingAddress } from '@/components/features/payment/BillingAddressForm'
import { TaxSummary } from '@/components/features/payment/TaxSummary'
import { getPaymentProcessors, type PaymentProcessor } from '@/lib/api/endpoints/paypal'
import { mapSubscriptionPlanToPlan } from '@/lib/utils/plan-mapper'
import Link from 'next/link'

type PaymentGateway = 'stripe' | 'paypal'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  
  const { data: plansData, isLoading } = usePlans()
  const rawPlan = plansData?.data?.find((p) => p.id === Number(planId))
  const selectedPlan = rawPlan ? mapSubscriptionPlanToPlan(rawPlan) : undefined

  const [gateway, setGateway] = useState<PaymentGateway>('stripe')
  const [processors, setProcessors] = useState<PaymentProcessor[]>([])
  const [paypalClientId, setPaypalClientId] = useState<string>('')
  const [billingAddress, setBillingAddress] = useState<BillingAddress>(DEFAULT_BILLING_ADDRESS)

  useEffect(() => {
    getPaymentProcessors()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : []
        setProcessors(list)
        const paypal = list.find((p) => p.slug === 'paypal')
        if (paypal?.settings?.paypal_client_id) {
          setPaypalClientId(paypal.settings.paypal_client_id)
        }
      })
      .catch(() => {})
  }, [])

  const hasPayPal = processors.some((p) => p.slug === 'paypal' && p.is_enabled)
  const hasStripe = processors.some((p) => p.slug === 'stripe' && p.is_enabled) || processors.length === 0

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
            You&apos;re subscribing to the <strong>{selectedPlan.name}</strong> plan
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Order Summary with Tax */}
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
              </dl>

              {/* Tax-aware pricing */}
              <div className="mt-4 border-t border-gray-200 pt-3">
                <TaxSummary
                  planId={Number(planId)}
                  planPrice={selectedPlan.price}
                  country={billingAddress.country}
                  state={billingAddress.state || undefined}
                />
              </div>

              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <p>✓ Cancel anytime</p>
                <p>✓ Secure payment</p>
                <p>✓ Instant access</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Billing Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
              <BillingAddressForm value={billingAddress} onChange={setBillingAddress} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {/* Gateway Selector */}
              {hasStripe && hasPayPal && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Pay with</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setGateway('stripe')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        gateway === 'stripe'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      💳 Credit Card
                    </button>
                    <button
                      onClick={() => setGateway('paypal')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        gateway === 'paypal'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      🅿️ PayPal
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {gateway === 'stripe' && hasStripe && (
                <StripeCheckoutForm plan={selectedPlan} />
              )}

              {gateway === 'paypal' && hasPayPal && paypalClientId && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">PayPal Payment</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      You&apos;ll be redirected to PayPal to complete your subscription.
                    </p>
                  </div>
                  <PayPalButton
                    plan={{
                      ...selectedPlan,
                      paypal_plan_id: (rawPlan as any)?.paypal_plan_id,
                    }}
                    clientId={paypalClientId}
                  />
                </div>
              )}

              {/* Fallback if only one is available */}
              {!hasStripe && !hasPayPal && (
                <div className="text-center py-8 text-sm text-gray-500">
                  No payment processors are currently configured. Please contact support.
                </div>
              )}
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

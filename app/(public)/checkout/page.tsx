'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { getPaymentProcessors, type PaymentProcessor } from '@/lib/api/endpoints/paypal'
import { mapSubscriptionPlanToPlan } from '@/lib/utils/plan-mapper'
import { useCheckout } from '@/lib/hooks/mutations/useSubscribe'
import Link from 'next/link'
import { CreditCard, Building2, Wallet, RefreshCcw, Shield, ArrowLeft } from 'lucide-react'

// Development fallback processors (used when API fails or returns empty)
const DEV_FALLBACK_PROCESSORS: PaymentProcessor[] = [
  { id: 1, name: 'Stripe', slug: 'stripe', is_enabled: true },
  { id: 2, name: 'PayPal', slug: 'paypal', is_enabled: true },
]

// Icons for payment processors
const ProcessorIcon = ({ slug }: { slug: string }) => {
  switch (slug) {
    case 'stripe':
      return <CreditCard className="w-5 h-5" />
    case 'paypal':
      return <Wallet className="w-5 h-5" />
    case 'razorpay':
    case 'paystack':
    case 'flutterwave':
      return <Building2 className="w-5 h-5" />
    default:
      return <CreditCard className="w-5 h-5" />
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan-id') || searchParams.get('plan')
  const isChangePlan = searchParams.get('action') === 'change-plan'

  const { data: plansData, isLoading } = usePlans()
  const rawPlan = plansData?.data?.find((p: any) => p.id === Number(planId))
  const selectedPlan = rawPlan ? mapSubscriptionPlanToPlan(rawPlan) : undefined

  const [processors, setProcessors] = useState<PaymentProcessor[]>([])
  const [selectedProcessor, setSelectedProcessor] = useState<string>('')
  const [loadingProcessors, setLoadingProcessors] = useState(true)
  const [processorError, setProcessorError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const checkout = useCheckout()

  const fetchProcessors = async () => {
    setLoadingProcessors(true)
    setProcessorError(null)

    try {
      const response = await getPaymentProcessors()

      // Handle various response formats from the API
      let list: PaymentProcessor[] = []

      if (Array.isArray(response)) {
        list = response
      } else if (response?.data && Array.isArray(response.data)) {
        list = response.data
      } else if (response?.data) {
        list = Array.isArray(response.data) ? response.data : []
      }

      // Filter enabled processors - check both is_enabled and enabled fields
      const enabled = list.filter((p: PaymentProcessor & { enabled?: boolean }) => {
        if (typeof p.is_enabled === 'boolean') return p.is_enabled
        if (typeof (p as any).enabled === 'boolean') return (p as any).enabled
        return true
      })

      if (enabled.length > 0) {
        setProcessors(enabled)
        setSelectedProcessor(enabled[0]?.slug || '')
        setUseFallback(false)
      } else {
        // No processors from API, use fallback in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Checkout] No payment processors from API, using development fallback')
          setProcessors(DEV_FALLBACK_PROCESSORS)
          setSelectedProcessor(DEV_FALLBACK_PROCESSORS[0]?.slug || '')
          setUseFallback(true)
        } else {
          setProcessors([])
        }
      }
    } catch (error) {
      console.error('[Checkout] Failed to fetch payment processors:', error)
      setProcessorError('Failed to load payment methods.')

      // Use fallback in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Checkout] API error, using development fallback processors')
        setProcessors(DEV_FALLBACK_PROCESSORS)
        setSelectedProcessor(DEV_FALLBACK_PROCESSORS[0]?.slug || '')
        setUseFallback(true)
        setProcessorError(null)
      }
    } finally {
      setLoadingProcessors(false)
    }
  }

  useEffect(() => {
    fetchProcessors()
  }, [])

  const handlePay = async () => {
    if (!planId || !selectedProcessor) return
    checkout.mutate({
      planId: Number(planId),
      processorSlug: selectedProcessor,
    })
  }

  const handleRetry = () => {
    fetchProcessors()
  }

  // Loading state
  if (isLoading || loadingProcessors) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Invalid plan state
  if (!planId || !selectedPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Invalid Plan</h2>
          <p className="mt-2 text-gray-600">
            The selected plan could not be found. Please select a plan from our pricing page.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View Pricing
          </Link>
        </div>
      </div>
    )
  }

  const price = Number(selectedPlan.price).toFixed(2)
  const currency = selectedPlan.currency || 'USD'
  const currencySymbol = currency === 'USD' ? '$' : currency

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isChangePlan ? 'Change Plan' : 'Complete Your Purchase'}
          </h1>
          <p className="mt-2 text-gray-600">
            You&apos;re subscribing to the{' '}
            <span className="font-semibold text-primary-600">{selectedPlan.name}</span> plan
          </p>
        </div>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <dl className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Plan</dt>
                <dd className="font-medium text-gray-900">{selectedPlan.name} Plan</dd>
              </div>

              {selectedPlan.limits.maxQRCodes !== null && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Dynamic QR codes</dt>
                  <dd className="font-medium text-primary-600">
                    {selectedPlan.limits.maxQRCodes === -1
                      ? 'Unlimited'
                      : selectedPlan.limits.maxQRCodes?.toLocaleString()}
                  </dd>
                </div>
              )}

              {selectedPlan.limits.maxScans !== null && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Scans</dt>
                  <dd className="font-medium text-primary-600">
                    {selectedPlan.limits.maxScans === -1
                      ? 'Unlimited'
                      : selectedPlan.limits.maxScans?.toLocaleString()}
                  </dd>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-gray-100">
                <dt className="text-gray-600">Billing Frequency</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {selectedPlan.frequency ?? 'monthly'}
                </dd>
              </div>

              <div className="flex justify-between pt-4 border-t-2 border-gray-200">
                <dt className="text-lg font-bold text-gray-900">Total</dt>
                <dd className="text-lg font-bold text-gray-900">
                  {currencySymbol}{price}
                  <span className="text-sm font-normal text-gray-500">
                    /{selectedPlan.frequency === 'yearly' ? 'year' : 'month'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Development Fallback Notice */}
          {useFallback && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">🔧</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Development Mode</p>
                  <p className="text-blue-600 mt-1">
                    Using fallback payment processors. Configure your backend payment processors
                    for production.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          {processors.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {processors.map((proc) => (
                  <button
                    key={proc.slug}
                    type="button"
                    onClick={() => setSelectedProcessor(proc.slug)}
                    className={`flex items-center gap-3 rounded-lg border-2 px-4 py-4 text-left transition-all ${
                      selectedProcessor === proc.slug
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        selectedProcessor === proc.slug
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <ProcessorIcon slug={proc.slug} />
                    </div>
                    <div>
                      <span
                        className={`block font-medium ${
                          selectedProcessor === proc.slug ? 'text-primary-700' : 'text-gray-900'
                        }`}
                      >
                        {proc.name || proc.slug}
                      </span>
                      <span className="text-xs text-gray-500">
                        {proc.slug === 'stripe' && 'Credit/Debit Card'}
                        {proc.slug === 'paypal' && 'PayPal Account'}
                        {!['stripe', 'paypal'].includes(proc.slug) && 'Payment Gateway'}
                      </span>
                    </div>
                    {selectedProcessor === proc.slug && (
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {processors.length === 0 && !loadingProcessors && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
              {processorError ? (
                <>
                  <span className="text-3xl mb-3 block">⚠️</span>
                  <p className="text-sm text-red-600 font-medium">{processorError}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <span className="text-3xl mb-3 block">🔧</span>
                  <p className="text-sm text-amber-700 font-medium mb-2">
                    No payment processors are currently configured.
                  </p>
                  <p className="text-xs text-amber-600">
                    Please configure payment processors in the admin dashboard at{' '}
                    <code className="bg-amber-100 px-1 rounded">/dashboard/payment-processors</code>
                  </p>
                </>
              )}
            </div>
          )}

          {/* Pay Button */}
          {processors.length > 0 && (
            <button
              type="button"
              onClick={handlePay}
              disabled={checkout.isPending || !selectedProcessor}
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              {checkout.isPending ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Pay {currencySymbol}{price}
                </span>
              )}
            </button>
          )}

          {/* Error Message */}
          {checkout.isError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg">❌</span>
                <div className="text-sm">
                  <p className="font-medium text-red-800">Payment Failed</p>
                  <p className="text-red-600 mt-1">
                    Unable to process payment. Please try again or choose a different payment
                    method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment powered by {selectedProcessor || 'trusted providers'}</span>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            By subscribing, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
            . You can cancel at any time.
          </p>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}

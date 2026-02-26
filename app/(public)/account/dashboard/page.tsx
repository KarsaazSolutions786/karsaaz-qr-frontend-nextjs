'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

/**
 * This route handles payment success redirects from payment processors.
 *
 * Stripe redirects to: /account/dashboard?payment_gateway=stripe&s_id={session_id}
 *
 * This page redirects to the proper /payment/success page with the same params.
 */
function PaymentRedirectHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Get payment params from URL
    const paymentGateway = searchParams.get('payment_gateway')
    const sessionId = searchParams.get('s_id')
    const processor = searchParams.get('processor')

    // Build redirect URL to payment success page
    const params = new URLSearchParams()

    if (paymentGateway) {
      params.set('payment_gateway', paymentGateway)
    }
    if (sessionId) {
      params.set('s_id', sessionId)
    }
    if (processor) {
      params.set('processor', processor)
    }

    const queryString = params.toString()
    const redirectUrl = `/payment/success${queryString ? `?${queryString}` : ''}`

    // Redirect to payment success page
    router.replace(redirectUrl)
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing payment...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we verify your payment.</p>
      </div>
    </div>
  )
}

export default function AccountDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentRedirectHandler />
    </Suspense>
  )
}

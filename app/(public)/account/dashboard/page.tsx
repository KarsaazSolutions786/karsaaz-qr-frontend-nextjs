'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: This route handles payment success redirects from payment processors. Stripe redirects to: /account/dashboard?payment_gateway=stripe&s_id={session_id} This page redirects to the proper /payment/success page with the same params.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function PaymentRedirectHandler() {
  const { t } = useTranslation()
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
        <LottieLoader size={100} className="mx-auto" />
        <p className="mt-4 text-gray-600">{t('Processing payment...')}</p>
        <p className="mt-2 text-sm text-gray-500">{t('Please wait while we verify your payment.')}</p>
      </div>
    </div>
  )
}

/**
 * Purpose: Executes AccountDashboardPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function AccountDashboardPage() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <LottieLoader size={100} className="mx-auto" />
            <p className="mt-4 text-gray-600">{t('Loading...')}</p>
          </div>
        </div>
      }
    >
      <PaymentRedirectHandler />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes PaymentCanceledPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PaymentCanceledPage() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(false)

  useEffect(() => {
    loadMessage()
  }, [])

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (autoRedirect && countdown === 0) {
      window.location.href = '/login'
    }
  }, [autoRedirect, countdown])

  /**
   * Purpose: Executes loadMessage functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  async function loadMessage() {
    try {
      const { data } = await apiClient.get('/payment/canceled')
      setMessage(data?.message || t('Your payment was canceled.'))
    } catch {
      setMessage(t('Your payment was canceled.'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <LottieLoader size={120} className="mx-auto mb-6" />
          <h1 className="text-xl font-bold text-gray-900">{t('Loading...')}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
        {/* Animated Warning Icon */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Payment Canceled')}</h1>
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-left">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">{t('What happened?')}</h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>• {t('You chose to cancel the payment process')}</li>
            <li>• {t('No charges were made to your account')}</li>
            <li>• {t('Your subscription status remains unchanged')}</li>
            <li>• {t('You can try again at any time')}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
          >
            {t('Try Again')}
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
          >
            {t('Back to Account')}
          </Link>
          <button
            onClick={() => setAutoRedirect(true)}
            disabled={autoRedirect}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors disabled:opacity-50"
          >
            {autoRedirect ? `${t('Redirecting')} (${countdown}s)` : t('Auto Redirect')}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api/client'

export default function PaymentInvalidPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(15)
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

  async function loadMessage() {
    try {
      const { data } = await apiClient.get('/payment/invalid')
      setMessage(data?.message || 'Payment verification failed.')
    } catch {
      setMessage('Payment verification failed.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6" />
          <h1 className="text-xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Possible Issues Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-left">
          <h3 className="text-sm font-semibold text-red-800 mb-2">🔍 Possible Issues</h3>
          <ul className="text-sm text-red-700 space-y-1.5">
            <li>• Payment processor verification failed</li>
            <li>• Session timeout during payment</li>
            <li>• Network issue interrupted the process</li>
            <li>• Invalid payment response received</li>
            <li>• Server error during verification</li>
          </ul>
        </div>

        {/* Support Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
          <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1">When contacting support, please provide:</h4>
          <ul className="text-xs text-gray-500 space-y-0.5">
            <li>• Approximate time of payment attempt</li>
            <li>• Payment method used</li>
            <li>• Error message shown above</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
          >
            🔄 Try Payment Again
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
          >
            🏠 Back to Account
          </Link>
          <a
            href="mailto:support@karsaazqr.com"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
          >
            💬 Contact Support
          </a>
          <button
            onClick={() => setAutoRedirect(true)}
            disabled={autoRedirect}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors disabled:opacity-50"
          >
            {autoRedirect ? `⏰ Redirecting (${countdown}s)` : '⏰ Auto Redirect'}
          </button>
        </div>
      </div>
    </div>
  )
}

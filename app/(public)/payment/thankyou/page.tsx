'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api/client'

const PRO_FEATURES = [
  '✨ Unlimited QR code designs',
  '🎨 Custom backgrounds & colors',
  '🖼️ Logo integration',
  '📱 4K high-resolution downloads',
  '📐 SVG vector format',
  '⚙️ Advanced customization options',
  '🎯 Priority support',
]

export default function PaymentThankYouPage() {
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessage()
  }, [])

  useEffect(() => {
    if (!loading && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (!loading && countdown === 0) {
      window.location.href = '/login'
    }
  }, [loading, countdown])

  async function loadMessage() {
    try {
      const { data } = await apiClient.get('/payment/thankyou')
      setMessage(data?.message || '')

      if (data?.clear_storage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch {
      // Continue with defaults
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
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        {/* PRO Features List */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6 text-left">
          <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
            Your PRO features are now active
          </h3>
          <ul className="space-y-2">
            {PRO_FEATURES.map((feature, i) => (
              <li key={i} className="text-sm text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Please log in again to see your updated subscription status.
        </p>
        <p className="text-sm text-gray-400">
          Redirecting to login in {countdown} seconds...
        </p>

        <Link
          href="/login"
          className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
        >
          Go to Login →
        </Link>
      </div>
    </div>
  )
}

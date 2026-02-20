'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api/client'

type PageState = 'loading' | 'success' | 'error'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<PageState>('loading')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    verifyPayment()
  }, [])

  useEffect(() => {
    if (state !== 'loading' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (state !== 'loading' && countdown === 0) {
      window.location.href = '/login'
    }
  }, [state, countdown])

  async function verifyPayment() {
    try {
      const paymentGateway = searchParams?.get('payment_gateway') || ''
      const sessionId = searchParams?.get('s_id') || ''
      const params: Record<string, string> = {}
      if (paymentGateway) params.payment_gateway = paymentGateway
      if (sessionId) params.s_id = sessionId

      const { data } = await apiClient.get('/payment/success', { params })

      if (data?.clear_storage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      if (data?.refresh_user_data && data?.user_data) {
        localStorage.setItem('user', JSON.stringify(data.user_data))
      }

      setMessage(data?.message || 'Your payment has been processed successfully.')
      setState('success')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'There was an error verifying your payment.')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {state === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
            <p className="text-gray-500">Please wait while we verify your payment.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-400">Redirecting you to login page in {countdown} seconds...</p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-400 mb-4">Redirecting in {countdown} seconds...</p>
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Go to Login →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

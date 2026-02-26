'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

type PageState = 'loading' | 'success' | 'error'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [state, setState] = useState<PageState>('loading')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    verifyPayment()
  }, [])

  useEffect(() => {
    if (state !== 'loading' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (state !== 'loading' && countdown === 0) {
      // Check if user is logged in - redirect to account page, otherwise to login
      const token = localStorage.getItem('token')
      if (token) {
        window.location.href = '/dashboard/qrcodes'
      } else {
        window.location.href = '/login'
      }
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

      // Always fetch fresh user data after successful payment
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Fetch fresh user data from /myself endpoint
          const freshUser = await authAPI.getCurrentUser()
          // Handle nested data response: { data: User } or User directly
          const userData = (freshUser as any)?.data ?? freshUser
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData))
            // Update TanStack Query cache and trigger refetch
            queryClient.setQueryData(queryKeys.auth.currentUser(), userData)
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() })
          }
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError)
          // Fallback to API response data if available
          if (data?.user_data) {
            localStorage.setItem('user', JSON.stringify(data.user_data))
            queryClient.setQueryData(queryKeys.auth.currentUser(), data.user_data)
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() })
          }
        }
      } else if (data?.refresh_user_data && data?.user_data) {
        localStorage.setItem('user', JSON.stringify(data.user_data))
        queryClient.setQueryData(queryKeys.auth.currentUser(), data.user_data)
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
            <p className="text-sm text-gray-400">Redirecting you to your dashboard in {countdown} seconds...</p>
            <Link href="/dashboard/qrcodes" className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium">
              Go to Dashboard Now →
            </Link>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}

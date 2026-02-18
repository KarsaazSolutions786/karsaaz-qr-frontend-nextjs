'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Suspense } from 'react'
import { User } from '@/types/entities/user'

/**
 * OAuth callback page — handles redirect from server-side OAuth flow.
 * The server redirects here with base64-encoded user and token data:
 *   /auth-callback?user=<base64>&token=<base64>
 */
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const userParam = searchParams.get('user')
      const tokenParam = searchParams.get('token')

      if (!userParam || !tokenParam) {
        setError('Invalid callback parameters. Please try logging in again.')
        return
      }

      // Decode base64 data
      const userData: User = JSON.parse(atob(userParam))
      const token = atob(tokenParam)

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
      }
      setUser(userData)

      // Redirect to user's home page
      const homePage = userData.roles?.[0]?.home_page || '/qrcodes'
      router.push(homePage)
    } catch {
      setError('Failed to process login. Please try again.')
    }
  }, [searchParams, router, setUser])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Login Failed</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <a
            href="/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Suspense } from 'react'
import { User } from '@/types/entities/user'
import { authWorkflowEngine, type OAuthProviderName } from '@/lib/services/auth-workflow'

/**
 * OAuth callback page — handles redirect from server-side OAuth flow.
 * Supports two modes:
 *   1. Base64: /auth-callback?user=<base64>&token=<base64> (existing flow)
 *   2. Code exchange: /auth-callback?code=<code>&provider=<provider> (new OAuth code flow)
 */
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function processCallback() {
      try {
        const code = searchParams.get('code')
        const provider = searchParams.get('provider') as OAuthProviderName | null
        const userParam = searchParams.get('user')
        const tokenParam = searchParams.get('token')

        let userData: User
        let token: string

        if (code && provider) {
          // OAuth code exchange flow
          const result = await authWorkflowEngine.handleCallback(provider, code)
          userData = result.user as unknown as User
          token = result.token
        } else if (userParam && tokenParam) {
          // Base64 encoded flow (existing)
          userData = JSON.parse(atob(userParam))
          token = atob(tokenParam)
        } else {
          setError('Invalid callback parameters. Please try logging in again.')
          return
        }

        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('token', token)
        }
        setUser(userData)

        // Redirect to user's home page
        const homePage = userData.roles?.[0]?.home_page || '/qrcodes/new'
        router.push(homePage)
      } catch {
        setError('Failed to process login. Please try again.')
      }
    }

    processCallback()
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

// T145: OAuth callback route supporting both base64 and code-exchange flows
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

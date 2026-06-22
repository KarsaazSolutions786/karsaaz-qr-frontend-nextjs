'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { Suspense } from 'react'
import { User } from '@/types/entities/user'
import {
  authWorkflowEngine,
  validateOAuthState,
  type OAuthProviderName,
} from '@/lib/services/auth-workflow'
import Link from 'next/link'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: OAuth callback page — handles redirect from server-side OAuth flow. Supports two modes: 1. Base64: /auth-callback?user=<base64>&token=<base64> (existing flow) 2. Code exchange: /auth-callback?code=<code>&provider=<provider> (new OAuth code flow)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Purpose: Executes processCallback functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    async function processCallback() {
      try {
        const code = searchParams.get('code')
        const provider = searchParams.get('provider') as OAuthProviderName | null
        const userParam = searchParams.get('user')
        const tokenParam = searchParams.get('token')
        const stateParam = searchParams.get('state')

        // SECURITY: Validate OAuth state parameter to prevent CSRF attacks
        if (!validateOAuthState(stateParam)) {
          console.error('[Security] OAuth state mismatch - possible CSRF attack')
          router.replace('/login?error=state_mismatch')
          return
        }

        // SECURITY: Block any legacy flow that passes a raw token in the URL.
        // Tokens in URLs are logged by servers/proxies and leak via Referer headers.
        if (tokenParam) {
          console.error(
            '[Security] Raw token in URL detected — blocked to prevent credential exposure'
          )
          router.replace('/login?error=invalid_callback')
          return
        }

        let userData: User

        let authToken: string | null = null

        if (code && provider) {
          // OAuth code exchange flow — persist Bearer token for cross-origin dev
          const result = await authWorkflowEngine.handleCallback(provider, code)
          userData = result.user as unknown as User
          authToken = result.token
        } else if (userParam && provider) {
          // Cookie-based redirect flow: backend set httpOnly auth_token cookie and
          // passed a non-sensitive base64 user payload in the URL (no token in URL).
          try {
            userData = JSON.parse(atob(decodeURIComponent(userParam))) as User
          } catch {
            console.error('[Security] Failed to decode user payload from OAuth redirect')
            router.replace('/login?error=invalid_callback')
            return
          }
        } else {
          setError(t('Invalid callback parameters. Please try logging in again.'))
          return
        }

        // Store auth data. Token is in httpOnly cookie from backend response.
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('logged_in', 'true')
          if (authToken) {
            localStorage.setItem('token', authToken)
          }
        }
        setUser(userData)

        // Redirect to user's home page
        let homePage = userData.roles?.[0]?.home_page || '/qrcodes/new'
        if (homePage.startsWith('/dashboard')) {
          homePage = homePage.replace('/dashboard', '')
        }
        router.push(homePage)
      } catch {
        setError(t('Failed to process login. Please try again.'))
      }
    }

    processCallback()
  }, [searchParams, router, setUser])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{t('Login Failed')}</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {t('Back to Login')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <LottieLoader size={100} className="mx-auto" />
        <p className="text-gray-600">{t('Completing login...')}</p>
      </div>
    </div>
  )
}

// T145: OAuth callback route supporting both base64 and code-exchange flows
/**
 * Purpose: Executes AuthCallbackPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function AuthCallbackPage() {
  const { t } = useTranslation()

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600">{t('Loading...')}</div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { authAPI } from '@/lib/api/endpoints/auth'
import type { LoginRequires2FAResponse } from '@/lib/api/endpoints/auth'
import { useTwoFactorLoginVerify } from '@/lib/hooks/mutations/useLogin'
import { queryKeys } from '@/lib/query/keys'
import { envConfig } from '@/lib/config/env-config'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void
          prompt: () => void
        }
      }
    }
  }
}

/**
 * Purpose: Executes GoogleLoginButton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function GoogleLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const twoFactorInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()
  const { t } = useTranslation()
  const twoFactorVerify = useTwoFactorLoginVerify()

  const [show2fa, setShow2fa] = useState(false)
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorError, setTwoFactorError] = useState('')

  // Focus 2FA input when shown
  useEffect(() => {
    if (show2fa) twoFactorInputRef.current?.focus()
  }, [show2fa])

  // Auto-submit 2FA when 6 digits entered
  useEffect(() => {
    if (show2fa && twoFactorCode.length === 6) {
      handle2faSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFactorCode, show2fa])

  /**
   * Purpose: Executes handle2faSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const handle2faSubmit = async () => {
    if (twoFactorCode.length < 6) return
    setTwoFactorError('')
    try {
      await twoFactorVerify.mutateAsync({
        two_factor_token: twoFactorToken,
        code: twoFactorCode,
      })
    } catch {
      setTwoFactorError(t('Invalid authentication code. Please try again.'))
    }
  }

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        const result = await authAPI.googleTokenLogin({
          credential: response.credential,
        })

        // Check if 2FA is required
        if ('requires_2fa' in result && result.requires_2fa) {
          const data = result as LoginRequires2FAResponse
          setTwoFactorToken(data.two_factor_token)
          setShow2fa(true)
          return
        }

        // Normal login - result has user + token
        const loginResult = result as { user: any; token: string }
        setUser(loginResult.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(loginResult.user))
          // Token is stored in httpOnly cookie by backend
          localStorage.setItem('logged_in', 'true')
          localStorage.removeItem('token') // Clean up legacy token
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), loginResult.user)

        const homePage =
          loginResult.user.roles?.[0]?.home_page?.replace('/dashboard', '') || '/qrcodes/new'
        router.push(homePage)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Google login failed:', error)
      }
    },
    [router, queryClient, setUser]
  )

  useEffect(() => {
    const clientId = envConfig.GOOGLE_CLIENT_ID
    if (!clientId) return

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    )

    /**
     * Purpose: Initializes the service or component.
     * Owner/Author: Syed Ashhad
     * Created/Updated: March 2026
     */
    const initializeGSI = () => {
      if (!window.google || !containerRef.current) return

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      })

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 193,
      })
    }

    if (existingScript && window.google) {
      initializeGSI()
    } else if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGSI
      document.head.appendChild(script)
    } else {
      // Script tag exists but hasn't loaded yet -- wait for it
      const checkInterval = setInterval(() => {
        if (window.google) {
          clearInterval(checkInterval)
          initializeGSI()
        }
      }, 100)
      // Stop checking after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10_000)
    }
  }, [handleCredentialResponse])

  // ── 2FA verification step ──
  if (show2fa) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg bg-white/10 px-4 py-2.5 text-center text-sm text-white/80">
          {t('Two-factor authentication required')}
        </div>

        <div>
          <label
            htmlFor="google-2fa-code"
            className="mb-1 block text-[12px] font-bold text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t('Authentication Code')}
          </label>
          <p
            className="mb-2 text-[11px] text-white/60"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t('Enter the 6-digit code from your authenticator app')}
          </p>
          <input
            ref={twoFactorInputRef}
            id="google-2fa-code"
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="000000"
            value={twoFactorCode}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setTwoFactorCode(val)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && twoFactorCode.length === 6) handle2faSubmit()
            }}
            disabled={twoFactorVerify.isPending}
            className="block w-full rounded-[8px] border-[0.695px] border-[#ebecef] bg-white/90 px-3 py-3 text-center text-2xl tracking-[8px] font-semibold text-gray-800 focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 disabled:opacity-50 transition-all"
          />
        </div>

        {twoFactorError && (
          <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
            <p className="text-xs text-red-100">{twoFactorError}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handle2faSubmit}
          disabled={twoFactorVerify.isPending || twoFactorCode.length !== 6}
          className="w-full rounded-[41.843px] text-[16px] font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          style={{
            height: 40,
            backgroundImage: 'linear-gradient(to bottom, #bb9df3, #8351e0)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {twoFactorVerify.isPending ? t('Verifying...') : t('Verify & Sign In')}
        </button>

        <button
          type="button"
          onClick={() => {
            setShow2fa(false)
            setTwoFactorCode('')
            setTwoFactorToken('')
            setTwoFactorError('')
          }}
          className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1"
        >
          {t('Back')}
        </button>
      </div>
    )
  }

  // Fallback: if NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set, use redirect flow
  const clientId = envConfig.GOOGLE_CLIENT_ID
  if (!clientId) {
    return (
      <button
        type="button"
        onClick={() => {
          window.location.href = authAPI.getGoogleRedirectUrl()
        }}
        className="relative flex items-center justify-center gap-2 bg-white text-[12.891px] text-black"
        style={{
          width: 193,
          height: 40,
          borderRadius: 20,
          boxShadow: '0px 4px 7px 0px rgba(0,0,0,0.13)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Inner shadow overlay */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ boxShadow: 'inset 0px 0px 4px 0px rgba(0,0,0,0.29)' }}
        />
        <img src="/images/auth/google-icon.svg" alt="" style={{ width: 16, height: 16 }} />
        {t('Google')}
      </button>
    )
  }

  return <div ref={containerRef} style={{ minWidth: 193, minHeight: 40 }} />
}

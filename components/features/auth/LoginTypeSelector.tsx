'use client'

/**
 * LoginTypeSelector — exact React replica of original login-type-selector.js
 *
 * On mount, fetches GET /api/passwordless-auth/status to check if passwordless
 * auth is enabled. Based on the result (and optional query params), renders:
 *
 *   - EmailOtpLoginForm   (if passwordless is enabled)
 *   - LoginForm           (default / traditional email+password)
 *
 * Query param overrides (matches original):
 *   ?dev=true         → force traditional login
 *   ?traditional=true → force traditional login
 */

import Image from 'next/image'
import Link from 'next/link'
import { Poppins } from 'next/font/google'
import { useTranslation } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'
import { usePasswordlessStatus } from '@/lib/hooks/mutations/usePasswordlessAuth'
import { EmailOtpLoginForm } from './EmailOtpLoginForm'
import { LoginForm } from './LoginForm'
import { GoogleLoginButton } from './GoogleLoginButton'
import { TwitterLoginButton } from './TwitterLoginButton'
import { FacebookLoginButton } from './FacebookLoginButton'
import { Auth0LoginButton } from './Auth0LoginButton'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export function LoginTypeSelector() {
  const searchParams = useSearchParams()
  const { data: statusData, isLoading, isError } = usePasswordlessStatus()

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-[23px] bg-white/30 p-12 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    )
  }

  // ── Query param overrides ──
  const forceDev = searchParams.get('dev') === 'true'
  const forceTraditional = searchParams.get('traditional') === 'true'

  if (forceDev || forceTraditional) {
    return <TraditionalLoginView />
  }

  // ── Passwordless enabled → show Email + OTP form ──
  if (!isError && statusData?.enabled === true) {
    return <EmailOtpLoginForm />
  }

  // ── Default: Traditional email + password login ──
  return <TraditionalLoginView />
}

/**
 * Traditional login view — card matching Figma design spec exactly
 *
 * Card: 447×543, bg rgba(255,255,255,0.3), rounded-[23px],
 *       shadow 0px 3px 12px 0px rgba(54,54,54,0.3)
 */
function TraditionalLoginView() {
  const { t } = useTranslation()

  return (
    <div
      className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]"
      style={{ minHeight: 543, padding: '40px 24px 30px' }}
    >
      {/* ── Header ── */}
      <div className="mb-9">
        {/* "Welcome to" + Karsaaz QR logo inline */}
        <div className="flex items-center gap-x-2">
          <h2
            className="whitespace-nowrap text-[28px] font-semibold leading-normal text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {t('Welcome to')}
          </h2>
          <Image
            src="/images/auth/karsaaz-logo.svg"
            alt="Karsaaz QR"
            width={176.5}
            height={36.9}
            priority
          />
        </div>

        {/* Subtitle */}
        <p
          className={`${poppins.className} mt-2 text-[18px] font-normal leading-normal text-white`}
        >
          {t('Sign in to your account and join us.')}
        </p>
      </div>

      {/* ── Login form ── */}
      <LoginForm />

      {/* ── Divider: lines + "or continue with" ── */}
      <div className="my-5 flex items-center justify-center gap-3">
        <img
          src="/images/auth/divider-line.svg"
          alt=""
          className="h-px w-[134px] flex-shrink-0"
          aria-hidden="true"
        />
        <span
          className="whitespace-nowrap text-[12px] font-medium text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t('or continue with')}
        </span>
        <img
          src="/images/auth/divider-line.svg"
          alt=""
          className="h-px w-[134px] flex-shrink-0"
          aria-hidden="true"
        />
      </div>

      {/* ── Social login buttons — side by side ── */}
      <div className="flex items-center justify-center gap-3">
        <GoogleLoginButton />
        <FacebookLoginButton />
      </div>

      {/* Hidden but functional */}
      <div className="hidden">
        <TwitterLoginButton />
        <Auth0LoginButton />
      </div>

      {/* ── Bottom text: "Don't have an account? Signup" ── */}
      <p
        className="mt-5 text-left text-[12px] font-medium text-white"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {t("Don't have an account?")}{' '}
        <Link
          href="/signup"
          className="font-semibold text-white underline decoration-solid hover:text-white/80"
        >
          {t('Signup')}
        </Link>
      </p>
    </div>
  )
}

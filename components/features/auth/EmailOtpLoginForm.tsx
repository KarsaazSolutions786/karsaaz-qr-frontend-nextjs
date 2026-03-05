'use client'

/**
 * EmailOtpLoginForm — exact React replica of original email-otp.js (Lit component)
 *
 * Flow:
 *  Step 1 (email):  User enters email → check-preference → either go to OTP or password
 *  Step 2a (otp):   6-digit OTP input, auto-submit on 6 digits, resend with 60s countdown
 *  Step 2b (password): traditional password input (for users who prefer password login)
 *
 * On success: stores token + user in localStorage, redirects to dashboard.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  usePasswordlessCheckPreference,
  usePasswordlessInit,
  usePasswordlessVerify,
  usePasswordlessResend,
} from '@/lib/hooks/mutations/usePasswordlessAuth'
import { useLogin, useTwoFactorLoginVerify } from '@/lib/hooks/mutations/useLogin'
import { GoogleLoginButton } from './GoogleLoginButton'

type Step = 'email' | 'otp' | 'password' | '2fa'

export function EmailOtpLoginForm() {
  // ── State ──
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const twoFactorInputRef = useRef<HTMLInputElement>(null)

  // ── Mutations ──
  const checkPreference = usePasswordlessCheckPreference()
  const initOtp = usePasswordlessInit()
  const verifyOtp = usePasswordlessVerify()
  const resendOtp = usePasswordlessResend()
  const loginMutation = useLogin()
  const twoFactorVerify = useTwoFactorLoginVerify()

  // ── Resend countdown (matches original: 60-second timer) ──
  const startResendCountdown = useCallback(() => {
    setResendCountdown(60)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  // Auto-focus inputs when step changes
  useEffect(() => {
    if (step === 'otp') otpInputRef.current?.focus()
    if (step === 'password') passwordInputRef.current?.focus()
    if (step === 'email') emailInputRef.current?.focus()
    if (step === '2fa') twoFactorInputRef.current?.focus()
  }, [step])

  // ── Auto-submit OTP when 6 digits are entered ──
  useEffect(() => {
    if (step === 'otp' && otp.length === 6) {
      handleVerifyOtp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step])

  // ── Auto-submit 2FA code when 6 digits are entered ──
  useEffect(() => {
    if (step === '2fa' && twoFactorCode.length === 6) {
      handle2faSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFactorCode, step])

  // ── Helpers ──
  function extractError(error: unknown, fallback: string): string {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    return err?.response?.data?.message || fallback
  }

  const isLoading =
    checkPreference.isPending ||
    initOtp.isPending ||
    verifyOtp.isPending ||
    resendOtp.isPending ||
    loginMutation.isPending ||
    twoFactorVerify.isPending

  // ── Step 1: Email submit → check preference → init OTP or go to password ──
  async function handleEmailSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setErrorMessage('')

    const trimmedEmail = emailInput.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    try {
      // Check user's per-user login preference (matches original flow)
      // NOTE: Admin (user_id=1) always returns 'traditional' from backend
      // — admin must always use email+password, never OTP
      const prefResult = await checkPreference.mutateAsync({ email: trimmedEmail })

      if (prefResult.login_method === 'traditional') {
        // User prefers traditional password login → show password step
        setEmail(trimmedEmail)
        setStep('password')
        return
      }

      // Proceed with OTP flow — send verification code
      const initResult = await initOtp.mutateAsync({ email: trimmedEmail })

      if (initResult.success) {
        setEmail(trimmedEmail)
        setStep('otp')
        startResendCountdown()
      } else {
        setErrorMessage(initResult.message || 'Failed to send verification code')
      }
    } catch (error) {
      setErrorMessage(extractError(error, 'Failed to send verification code. Please try again.'))
    }
  }

  // ── Step 2a: Verify OTP ──
  async function handleVerifyOtp() {
    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code')
      return
    }
    setErrorMessage('')

    try {
      await verifyOtp.mutateAsync({ email, otp })
      // On success: usePasswordlessVerify handles storing token + redirect
    } catch (error) {
      setErrorMessage(
        extractError(error, 'Invalid or expired verification code. Please try again.')
      )
    }
  }

  // ── Resend OTP ──
  async function handleResendOtp() {
    if (resendCountdown > 0) return
    setErrorMessage('')

    try {
      const result = await resendOtp.mutateAsync({ email })
      if (result.success) {
        startResendCountdown()
      } else {
        setErrorMessage(result.message || 'Failed to resend verification code')
      }
    } catch (error) {
      setErrorMessage(extractError(error, 'Failed to resend verification code. Please try again.'))
    }
  }

  // ── Step 2b: Password fallback (for users who prefer traditional) ──
  async function handlePasswordSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!password) {
      setErrorMessage('Please enter your password')
      return
    }
    setErrorMessage('')

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      })
      // Check if 2FA is required
      if (result && 'requires_2fa' in result && result.requires_2fa) {
        setTwoFactorToken((result as { two_factor_token: string }).two_factor_token)
        setStep('2fa')
        return
      }
      // On success: useLogin handles storing token + redirect
    } catch (error) {
      setErrorMessage(extractError(error, 'Invalid email or password. Please try again.'))
    }
  }

  // ── Step 3: 2FA TOTP verification ──
  async function handle2faSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setErrorMessage('Please enter the 6-digit authentication code')
      return
    }
    setErrorMessage('')

    try {
      await twoFactorVerify.mutateAsync({
        two_factor_token: twoFactorToken,
        code: twoFactorCode,
      })
      // On success: useTwoFactorLoginVerify handles storing token + redirect
    } catch (error) {
      setErrorMessage(extractError(error, 'Invalid authentication code. Please try again.'))
    }
  }

  // ── Go back to email step (matches original goBackToEmail) ──
  function goBackToEmail() {
    setStep('email')
    setOtp('')
    setPassword('')
    setErrorMessage('')
    if (countdownRef.current) clearInterval(countdownRef.current)
    setResendCountdown(0)
  }

  // ── Step indicator (matches original exactly: two circles with connecting line) ──
  function renderStepIndicator() {
    const isSecondStep = step === 'otp' || step === 'password'
    const is2faStep = step === '2fa'
    return (
      <div className="flex items-center justify-center gap-2.5 mb-5">
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            isSecondStep || is2faStep
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-white'
          }`}
        >
          {isSecondStep || is2faStep ? '✓' : '1'}
        </div>
        <div
          className={`w-[50px] h-[2px] transition-all duration-300 ${
            isSecondStep || is2faStep
              ? 'bg-gradient-to-r from-[#bb9df3] to-[#8351e0]'
              : 'bg-white/30'
          }`}
        />
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            is2faStep
              ? 'bg-green-500 text-white'
              : isSecondStep
                ? 'bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-white'
                : 'bg-white/30 text-white/60'
          }`}
        >
          {is2faStep ? '✓' : '2'}
        </div>
        {/* Show 3rd step indicator when 2FA is active */}
        {is2faStep && (
          <>
            <div className="w-[50px] h-[2px] transition-all duration-300 bg-gradient-to-r from-[#bb9df3] to-[#8351e0]" />
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-white">
              3
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Heading text (matches original getHeadingText) ──
  function getHeadingText(): string {
    switch (step) {
      case 'otp':
        return 'Enter the verification code we sent you.'
      case 'password':
        return 'Enter your password to sign in.'
      case '2fa':
        return 'Enter your two-factor authentication code.'
      default:
        return 'Sign in or create an account with your email.'
    }
  }

  // ── Email step (matches original renderEmailStep) ──
  function renderEmailStep() {
    if (step !== 'email') return null
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="passwordless-email" className="mb-1.5 block text-xs font-bold text-white">
            Enter Your Email
          </label>
          <input
            ref={emailInputRef}
            id="passwordless-email"
            type="email"
            autoFocus
            autoComplete="email"
            placeholder="your@email.com"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleEmailSubmit()
            }}
            disabled={isLoading}
            className="block h-10 w-full rounded-lg border border-[#ebecef] bg-white/90 pl-4 pr-4 text-xs text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 disabled:opacity-50 transition-all"
          />
        </div>

        {renderError()}

        <button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full rounded-[41.843px] bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-base font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:from-[#c7aef5] hover:to-[#9366e8] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Please wait...' : 'Continue with Email'}
        </button>
      </form>
    )
  }

  // ── OTP step (matches original renderOtpStep) ──
  function renderOtpStep() {
    if (step !== 'otp') return null
    return (
      <div className="space-y-4">
        {/* Email display badge */}
        <div className="bg-white/10 px-4 py-2.5 rounded-lg text-center text-sm text-white/80">
          We sent a verification code to <strong className="text-white">{email}</strong>
        </div>

        <div>
          <label htmlFor="otp-input" className="mb-1.5 block text-xs font-bold text-white">
            Enter Verification Code
          </label>
          <input
            ref={otpInputRef}
            id="otp-input"
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(val)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && otp.length === 6) handleVerifyOtp()
            }}
            disabled={isLoading}
            className="block w-full rounded-lg border border-[#ebecef] bg-white/90 px-3 py-3 text-center text-2xl tracking-[8px] font-semibold text-gray-800 focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 disabled:opacity-50 transition-all"
          />
        </div>

        {renderError()}

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={isLoading || otp.length !== 6}
          className="h-10 w-full rounded-[41.843px] bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-base font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:from-[#c7aef5] hover:to-[#9366e8] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {verifyOtp.isPending ? 'Verifying...' : 'Verify & Continue'}
        </button>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={goBackToEmail}
            className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1"
          >
            ← Change Email
          </button>

          {resendCountdown > 0 ? (
            <span className="text-sm text-white/50">Resend in {resendCountdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtp.isPending}
              className="text-sm text-white/80 hover:text-white hover:underline disabled:opacity-50"
            >
              {resendOtp.isPending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Password fallback step (matches original renderPasswordStep) ──
  function renderPasswordStep() {
    if (step !== 'password') return null
    return (
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        {/* Email display badge */}
        <div className="bg-white/10 px-4 py-2.5 rounded-lg text-center text-sm text-white/80">
          Logging in as <strong className="text-white">{email}</strong>
        </div>

        <div>
          <label htmlFor="password-input" className="mb-1.5 block text-xs font-bold text-white">
            Enter Your Password
          </label>
          <div className="relative">
            <input
              ref={passwordInputRef}
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              autoFocus
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handlePasswordSubmit()
              }}
              disabled={isLoading}
              className="block h-[41px] w-full rounded-lg border border-[#ebecef] bg-white/90 pl-4 pr-10 text-xs text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 disabled:opacity-50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#404a60] hover:text-gray-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {renderError()}

        <button
          type="submit"
          disabled={isLoading || !password}
          className="h-10 w-full rounded-[41.843px] bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-base font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:from-[#c7aef5] hover:to-[#9366e8] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </button>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={goBackToEmail}
            className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1"
          >
            ← Change Email
          </button>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-white hover:text-white/80 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    )
  }

  // ── 2FA TOTP verification step ──
  function render2faStep() {
    if (step !== '2fa') return null
    return (
      <div className="space-y-4">
        <div className="bg-white/10 px-4 py-2.5 rounded-lg text-center text-sm text-white/80">
          Two-factor authentication is enabled for <strong className="text-white">{email}</strong>
        </div>

        <div>
          <label htmlFor="2fa-input" className="mb-1.5 block text-xs font-bold text-white">
            Authentication Code
          </label>
          <p className="mb-2 text-xs text-white/60">
            Enter the 6-digit code from your authenticator app
          </p>
          <input
            ref={twoFactorInputRef}
            id="2fa-input"
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
            disabled={isLoading}
            className="block w-full rounded-lg border border-[#ebecef] bg-white/90 px-3 py-3 text-center text-2xl tracking-[8px] font-semibold text-gray-800 focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 disabled:opacity-50 transition-all"
          />
        </div>

        {renderError()}

        <button
          type="button"
          onClick={handle2faSubmit}
          disabled={isLoading || twoFactorCode.length !== 6}
          className="h-10 w-full rounded-[41.843px] bg-gradient-to-b from-[#bb9df3] to-[#8351e0] text-base font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:from-[#c7aef5] hover:to-[#9366e8] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {twoFactorVerify.isPending ? 'Verifying...' : 'Verify & Sign In'}
        </button>

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => {
              setStep('password')
              setTwoFactorCode('')
              setTwoFactorToken('')
              setErrorMessage('')
            }}
            className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  // ── Error display ──
  function renderError() {
    if (!errorMessage) return null
    return (
      <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
        <p className="text-xs text-red-100">{errorMessage}</p>
      </div>
    )
  }

  // ── Main render — wrapped in glassmorphism card matching Figma design ──
  return (
    <div
      className="flex flex-col w-[447px] max-w-full rounded-[23px] bg-white/30 px-8 py-8 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]"
      style={{ minHeight: 543 }}
    >
      {/* Heading */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-x-2">
          <h2
            className="whitespace-nowrap text-[28px] font-semibold leading-normal text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Welcome to
          </h2>
          <Image
            src="/images/auth/karsaaz-logo.svg"
            alt="Karsaaz QR"
            width={176.5}
            height={36.9}
            priority
          />
        </div>
        <p className="mt-2 text-sm text-white/80">{getHeadingText()}</p>
      </div>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Google OAuth — only shown on email step */}
      {step === 'email' && (
        <>
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent px-3 text-white/60">OR</span>
            </div>
          </div>
        </>
      )}

      {/* Step-specific forms */}
      {renderEmailStep()}
      {renderOtpStep()}
      {renderPasswordStep()}
      {render2faStep()}
    </div>
  )
}

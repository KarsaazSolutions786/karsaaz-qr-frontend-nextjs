'use client'

/**
 * EmailOtpLoginForm — exact React replica of original email-otp.js (Lit component)
 *
 * Flow:
 *  Step 1 (email):  User enters email → check-preference → either go to OTP or password
 *  Step 2a (otp):   5-digit OTP input, auto-submit on 5 digits, resend with 60s countdown
 *  Step 2b (password): traditional password input (for users who prefer password login)
 *
 * On success: stores token + user in localStorage, redirects to dashboard.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  usePasswordlessCheckPreference,
  usePasswordlessInit,
  usePasswordlessVerify,
  usePasswordlessResend,
} from '@/lib/hooks/mutations/usePasswordlessAuth'
import { useLogin } from '@/lib/hooks/mutations/useLogin'
import { GoogleLoginButton } from './GoogleLoginButton'

type Step = 'email' | 'otp' | 'password'

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

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  // ── Mutations ──
  const checkPreference = usePasswordlessCheckPreference()
  const initOtp = usePasswordlessInit()
  const verifyOtp = usePasswordlessVerify()
  const resendOtp = usePasswordlessResend()
  const loginMutation = useLogin()

  // ── Resend countdown (matches original: 60-second timer) ──
  const startResendCountdown = useCallback(() => {
    setResendCountdown(60)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
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
  }, [step])

  // ── Auto-submit OTP when 5 digits are entered (matches original) ──
  useEffect(() => {
    if (step === 'otp' && otp.length === 5) {
      handleVerifyOtp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step])

  // ── Helpers ──
  function extractError(error: unknown, fallback: string): string {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    return err?.response?.data?.message || err?.message || fallback
  }

  const isLoading =
    checkPreference.isPending ||
    initOtp.isPending ||
    verifyOtp.isPending ||
    resendOtp.isPending ||
    loginMutation.isPending

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
    if (!otp || otp.length !== 5) {
      setErrorMessage('Please enter the 5-digit verification code')
      return
    }
    setErrorMessage('')

    try {
      await verifyOtp.mutateAsync({ email, otp })
      // On success: usePasswordlessVerify handles storing token + redirect
    } catch (error) {
      setErrorMessage(extractError(error, 'Invalid or expired verification code. Please try again.'))
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
      await loginMutation.mutateAsync({
        email,
        password,
      })
      // On success: useLogin handles storing token + redirect
    } catch (error) {
      setErrorMessage(extractError(error, 'Invalid email or password. Please try again.'))
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
    return (
      <div className="flex items-center justify-center gap-2.5 mb-5">
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            isSecondStep
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-b from-purple-300 to-purple-600 text-white'
          }`}
        >
          {isSecondStep ? '✓' : '1'}
        </div>
        <div
          className={`w-[50px] h-[2px] transition-all duration-300 ${
            isSecondStep
              ? 'bg-gradient-to-r from-purple-300 to-purple-600'
              : 'bg-gray-200'
          }`}
        />
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            isSecondStep
              ? 'bg-gradient-to-b from-purple-300 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          2
        </div>
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
      default:
        return 'Sign in or create an account with your email.'
    }
  }

  // ── Email step (matches original renderEmailStep) ──
  function renderEmailStep() {
    if (step !== 'email') return null
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-5">
        <div>
          <label htmlFor="passwordless-email" className="block text-sm font-medium text-gray-700 mb-1">
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
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit() }}
            disabled={isLoading}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {renderError()}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-gradient-to-b from-purple-400 to-purple-700 px-4 py-2.5 text-white font-medium hover:from-purple-500 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
      <div className="space-y-5">
        {/* Email display badge (matches original email-display) */}
        <div className="bg-purple-50 px-4 py-2.5 rounded-lg text-center text-sm text-gray-600">
          We sent a verification code to{' '}
          <strong className="text-purple-600">{email}</strong>
        </div>

        <div>
          <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Verification Code
          </label>
          <input
            ref={otpInputRef}
            id="otp-input"
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={5}
            placeholder="12345"
            value={otp}
            onChange={(e) => {
              // Only allow digits
              const val = e.target.value.replace(/\D/g, '').slice(0, 5)
              setOtp(val)
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && otp.length === 5) handleVerifyOtp() }}
            disabled={isLoading}
            className="block w-full rounded-md border border-gray-300 px-3 py-3 text-center text-2xl tracking-[8px] font-semibold shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {renderError()}

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={isLoading || otp.length !== 5}
          className="w-full rounded-md bg-gradient-to-b from-purple-400 to-purple-700 px-4 py-2.5 text-white font-medium hover:from-purple-500 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {verifyOtp.isPending ? 'Verifying...' : 'Verify & Continue'}
        </button>

        {/* Bottom actions: change email + resend (matches original otp-actions) */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={goBackToEmail}
            className="text-sm text-purple-600 hover:underline flex items-center gap-1"
          >
            ← Change Email
          </button>

          {resendCountdown > 0 ? (
            <span className="text-sm text-gray-400">
              Resend in {resendCountdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtp.isPending}
              className="text-sm text-purple-600 hover:underline disabled:opacity-50"
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
      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        {/* Email display badge */}
        <div className="bg-purple-50 px-4 py-2.5 rounded-lg text-center text-sm text-gray-600">
          Logging in as{' '}
          <strong className="text-purple-600">{email}</strong>
        </div>

        <div>
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">
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
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordSubmit() }}
              disabled={isLoading}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {renderError()}

        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full rounded-md bg-gradient-to-b from-purple-400 to-purple-700 px-4 py-2.5 text-white font-medium hover:from-purple-500 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </button>

        {/* Bottom actions: change email + forgot password */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={goBackToEmail}
            className="text-sm text-purple-600 hover:underline flex items-center gap-1"
          >
            ← Change Email
          </button>
          <Link
            href="/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    )
  }

  // ── Error display ──
  function renderError() {
    if (!errorMessage) return null
    return (
      <div className="rounded-md bg-red-50 p-3">
        <p className="text-sm text-red-800">{errorMessage}</p>
      </div>
    )
  }

  // ── Main render (matches original renderForm structure exactly) ──
  return (
    <div className="space-y-6">
      {/* Heading (matches original heading section) */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-purple-600">Karsaaz</span>{' '}
          <span className="text-gray-700">QR</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">{getHeadingText()}</p>
      </div>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Google OAuth — only shown on email step (matches original) */}
      {step === 'email' && (
        <>
          <GoogleLoginButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">OR</span>
            </div>
          </div>
        </>
      )}

      {/* Step-specific forms */}
      {renderEmailStep()}
      {renderOtpStep()}
      {renderPasswordStep()}
    </div>
  )
}

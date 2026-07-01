'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useLogin, useTwoFactorLoginVerify } from '@/lib/hooks/mutations/useLogin'
import { useTranslation } from '@/lib/i18n'
import type { LoginRequires2FAResponse } from '@/lib/api/endpoints/auth'

const GENERIC_LOGIN_ERROR = 'Invalid email or password. Please try again.'

function normalizeLoginError(message: string | undefined): string {
  if (!message) return GENERIC_LOGIN_ERROR
  const lower = message.toLowerCase()
  if (
    lower.includes('credential') ||
    (lower.includes('password') && lower.includes('incorrect')) ||
    lower.includes('invalid email') ||
    lower.includes('provided credentials')
  ) {
    return GENERIC_LOGIN_ERROR
  }
  return message
}

/**
 * Purpose: Executes LoginForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function LoginForm() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [show2fa, setShow2fa] = useState(false)
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorError, setTwoFactorError] = useState('')
  const twoFactorInputRef = useRef<HTMLInputElement>(null)

  const loginMutation = useLogin()
  const twoFactorVerify = useTwoFactorLoginVerify()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Transition to 2FA step when login returns requires_2fa
  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data && 'requires_2fa' in loginMutation.data) {
      const data = loginMutation.data as LoginRequires2FAResponse
      setTwoFactorToken(data.two_factor_token)
      setShow2fa(true)
    }
  }, [loginMutation.isSuccess, loginMutation.data])

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
   * Purpose: Executes onSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // Error handled by mutation
    }
  }

  /**
   * Purpose: Executes handle2faSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handle2faSubmit = async () => {
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setTwoFactorError(t('Please enter the 6-digit authentication code'))
      return
    }
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

  // ── 2FA verification view ──
  if (show2fa) {
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg bg-white/10 px-4 py-2.5 text-center text-sm text-white/80">
          {t('Two-factor authentication required')}
        </div>

        <div>
          <label
            htmlFor="2fa-code"
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
            id="2fa-code"
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
          <div role="alert" className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
            <p className="text-xs text-red-100">{twoFactorError}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handle2faSubmit}
          disabled={twoFactorVerify.isPending || twoFactorCode.length !== 6}
          className="w-full rounded-[41.843px] text-[16px] font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
            loginMutation.reset()
          }}
          className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1"
        >
          {t('Back to login')}
        </button>
      </div>
    )
  }

  // ── Standard login form ──
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[12px] font-bold text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t('Email')}
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Example@gmail.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="block w-full rounded-[8px] border-[0.695px] border-[#ebecef] bg-white/90 px-4 text-[12px] font-normal text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 transition-all"
          style={{ height: 40, fontFamily: "'Inter', sans-serif" }}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-200">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-[12px] font-bold text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t('Password')}
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="******************"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="block w-full rounded-[8px] border-[0.695px] border-[#ebecef] bg-white/90 pl-4 pr-10 text-[12px] font-normal text-gray-800 placeholder:text-[#404a60] focus:border-[#8351e0] focus:outline-none focus:ring-2 focus:ring-[#8351e0]/30 transition-all"
            style={{ height: 41, fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404a60] hover:text-gray-700 transition-colors"
            aria-label={showPassword ? t('Hide password') : t('Show password')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-red-200">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-[12px] font-medium text-white hover:text-white/80 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t('Forget password?')}
        </Link>
      </div>

      {/* Error message */}
      {loginMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
          <p className="text-xs text-red-100">
            {(() => {
              const err = loginMutation.error as any
              const status = err?.response?.status
              const data = err?.response?.data
              if (status === 429) return t('Too many requests. Please wait a moment and try again.')
              const firstValidationError = data?.validationErrors
                ? ((Object.values(data.validationErrors as Record<string, string[]>).flat()[0] as
                    | string
                    | undefined) ?? null)
                : null
              return normalizeLoginError(firstValidationError || data?.message) || t(GENERIC_LOGIN_ERROR)
            })()}
          </p>
        </div>
      )}

      {/* Submit button — purple gradient pill */}
      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full rounded-[41.843px] text-[16px] font-semibold text-white shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        style={{
          height: 40,
          backgroundImage: 'linear-gradient(to bottom, #bb9df3, #8351e0)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {isSubmitting || loginMutation.isPending ? t('Signing in...') : t('Login')}
      </button>
    </form>
  )
}



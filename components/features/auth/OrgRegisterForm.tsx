'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useRegisterOrganization } from '@/lib/hooks/mutations/useRegisterOrganization'
import { useTranslation } from '@/lib/i18n'
import { PasswordStrengthBar } from '@/lib/utils/password-strength'
import { extractReferralCode, storeReferralCode } from '@/lib/utils/referral-tracking'

/**
 * Purpose: Combined "create your account + your organization" signup form --
 * shown instead of the normal RegisterForm when ?intent=organization is present.
 * One submit creates the personal account AND the organization it owns, then
 * lands the new owner on /organization (their org's self-serve area) instead of
 * the normal /qrcodes/new.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export function OrgRegisterForm({
  onRegistrationDisabled,
}: { onRegistrationDisabled?: () => void } = {}) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegisterOrganization()
  const searchParams = useSearchParams()

  useEffect(() => {
    const refCode = searchParams?.get('ref')
    if (refCode) {
      storeReferralCode(refCode)
    } else if (typeof window !== 'undefined') {
      const fromUrl = extractReferralCode(window.location.href)
      if (fromUrl) storeReferralCode(fromUrl)
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data)
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || ''
      if (
        message.toLowerCase().includes('registration') &&
        message.toLowerCase().includes('disabled')
      ) {
        onRegistrationDisabled?.()
      }
    }
  }

  return (
    <div
      className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]"
      style={{ minHeight: 543, padding: '40px 24px 30px' }}
    >
      <div className="mb-6 text-center">
        <h2 className="flex flex-col items-center justify-center text-2xl font-bold text-white">
          <div className="flex items-center justify-center gap-x-2">
            <span>{t('Create your')}</span>
            <Image
              src="/images/auth/karsaaz-logo.svg"
              alt="Karsaaz QR"
              width={110}
              height={26}
              className="inline-block translate-y-[2px]"
            />
          </div>
          <span className="mt-1">{t('organization')}</span>
        </h2>
        <p className="mt-2 text-sm text-white/90 px-4 leading-relaxed">
          {t('One step: your account and your organization, both set up together.')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-white/90">Your full name</label>
          <input
            type="text"
            {...register('name')}
            placeholder="John Doe"
            className="mt-1 block w-full rounded-md border-gray-300 bg-white/80 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-200">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/90">Your email address</label>
          <input
            type="email"
            {...register('email')}
            placeholder="johndoe@example.com"
            className="mt-1 block w-full rounded-md border-gray-300 bg-white/80 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-200">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white/90">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="block w-full rounded-md border-gray-300 bg-white/80 px-3 py-2 pr-12 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <PasswordStrengthBar password={password} />
          {errors.password && (
            <p className="mt-1 text-sm text-red-200">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-white/90">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="••••••••"
            className="mt-1 block w-full rounded-md border-gray-300 bg-white/80 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-200">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Consent */}
        <div className="flex items-start pt-2">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              {...register('termsConsent')}
              className="h-4 w-4 rounded border-gray-300 text-[#8351e0] focus:ring-[#8351e0]"
            />
          </div>
          <div className="ml-2 text-xs text-white/90">
            <label htmlFor="terms">
              {t('I agree to the')}{' '}
              <a href="/terms" className="underline hover:text-white" target="_blank">
                {t('Terms of Service')}
              </a>{' '}
              {t('and')}{' '}
              <a href="/privacy" className="underline hover:text-white" target="_blank">
                {t('Privacy Policy')}
              </a>
            </label>
          </div>
        </div>
        {errors.termsConsent && (
          <p className="mt-1 text-sm text-red-200">{errors.termsConsent.message}</p>
        )}

        {/* Form Error */}
        {registerMutation.isError && (
          <div className="rounded-md bg-red-400/20 p-3">
            <p className="text-sm text-red-100 text-center">
              {(registerMutation.error as any)?.response?.data?.message ||
                'Registration failed. Please try again.'}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            className="w-full flex justify-center rounded-full bg-[#8351e0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#7244c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8351e0] disabled:opacity-70 transition-colors"
          >
            {isSubmitting || registerMutation.isPending ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center space-y-3">
        <p className="text-xs text-white/90">
          {t('Already have a personal account?')}{' '}
          <Link
            href="/login"
            className="font-semibold text-white underline decoration-solid hover:text-white/80"
          >
            {t('Sign in')}
          </Link>
        </p>
        <p className="text-xs text-white/90">
          {t('Already manage an organization?')}{' '}
          <Link
            href="/organization/login"
            className="font-semibold text-white underline decoration-solid hover:text-white/80"
          >
            {t('Sign in to the Organization Portal')}
          </Link>
        </p>
      </div>
    </div>
  )
}

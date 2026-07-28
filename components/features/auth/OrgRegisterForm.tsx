'use client'
'use no memo'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { orgRegisterSchema, type OrgRegisterFormData } from '@/lib/validations/auth'
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
}: {
  onRegistrationDisabled?: () => void
}) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegisterOrganization()
  const searchParams = useSearchParams()
  const router = useRouter()

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
  } = useForm<OrgRegisterFormData>({
    resolver: zodResolver(orgRegisterSchema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: OrgRegisterFormData) => {
    if (onRegistrationDisabled) onRegistrationDisabled()
    try {
      const params = new URLSearchParams({
        email: data.email,
        name: data.name,
        orgName: data.organizationName,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsConsent: String(data.termsConsent),
      })
      router.push(`/organization-onboard?${params.toString()}`)
    } catch (error: any) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="organizationName" className="mb-1 block text-xs font-bold text-white">
          {t('Organization name')}
        </label>
        <input
          {...register('organizationName')}
          id="organizationName"
          type="text"
          autoComplete="organization"
          aria-invalid={!!errors.organizationName}
          aria-describedby={errors.organizationName ? 'organizationName-error' : undefined}
          className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          placeholder="Acme Inc."
        />
        {errors.organizationName && (
          <p id="organizationName-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.organizationName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-bold text-white">
          {t('Your full name')}
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          placeholder="John Doe"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-bold text-white">
          {t('Your email address')}
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-bold text-white">
          {t('Password')}
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 pr-20 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? t('Hide') : t('Show')}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.password.message}
          </p>
        )}

        <PasswordStrengthBar password={password} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-xs font-bold text-white">
          {t('Confirm password')}
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            {...register('termsConsent')}
            id="termsConsent"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-200 bg-white/90 text-purple-600 focus:ring-purple-500"
          />
        </div>
        <div className="ml-3 text-xs">
          <label htmlFor="termsConsent" className="text-white/90">
            {t('I agree to the')}{' '}
            <a
              href="/terms"
              target="_blank"
              className="font-semibold text-white underline decoration-solid hover:text-white/80"
            >
              {t('Terms of Service')}
            </a>{' '}
            {t('and')}{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              className="font-semibold text-white underline decoration-solid hover:text-white/80"
            >
              {t('Privacy Policy')}
            </a>
          </label>
          {errors.termsConsent && (
            <p className="mt-1 text-xs text-red-700">{errors.termsConsent.message}</p>
          )}
        </div>
      </div>

      {registerMutation.isError && (
        <div
          role="alert"
          className="rounded-lg bg-red-500/25 border border-red-500/40 p-4 text-white text-xs"
        >
          <p className="text-xs font-medium text-red-100">
            {(registerMutation.error as any)?.response?.data?.message ||
              t('Registration failed. Please try again.')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#8351e0] py-2.5 text-sm font-semibold text-white hover:bg-[#7244c8] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t('Please wait...') : t('Continue')}
      </button>

      <p className="text-center text-xs text-white/90">
        {t('Already have a personal account?')}{' '}
        <Link
          href="/login"
          className="font-semibold text-white underline decoration-solid hover:text-white/80"
        >
          {t('Sign in')}
        </Link>
      </p>
    </form>
  )
}

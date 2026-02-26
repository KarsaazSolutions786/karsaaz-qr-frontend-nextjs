'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useRegister } from '@/lib/hooks/mutations/useRegister'
import { PasswordStrengthBar } from '@/lib/utils/password-strength'
import { extractReferralCode, storeReferralCode } from '@/lib/utils/referral-tracking'

export function RegisterForm({
  onRegistrationDisabled,
}: { onRegistrationDisabled?: () => void } = {}) {
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegister()
  const searchParams = useSearchParams()

  // T269: Detect referral code from URL params and store it
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
      // Success is handled by the mutation (redirects to verify-email)
    } catch (error: any) {
      // Check if registration is disabled
      const message = error?.response?.data?.message || error?.message || ''
      if (
        message.toLowerCase().includes('registration') &&
        message.toLowerCase().includes('disabled')
      ) {
        onRegistrationDisabled?.()
      }
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="John Doe"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mt-1">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-20 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}

        {/* Password strength indicator */}
        <PasswordStrengthBar password={password} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <input
          {...register('confirmPassword')}
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms consent checkbox */}
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            {...register('termsConsent')}
            id="termsConsent"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="termsConsent" className="text-gray-600">
            I agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              target="_blank"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Privacy Policy
            </a>
          </label>
          {errors.termsConsent && (
            <p className="mt-1 text-sm text-red-600">{errors.termsConsent.message}</p>
          )}
        </div>
      </div>

      {registerMutation.isError && (
        <div role="alert" className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(registerMutation.error as any)?.response?.data?.message || 'Registration failed. Please try again.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </form>
  )
}

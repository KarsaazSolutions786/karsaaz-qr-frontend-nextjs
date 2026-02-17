'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { useForgotPassword } from '@/lib/hooks/mutations/useForgotPassword'

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Password reset instructions sent! Check your email.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {forgotPasswordMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(forgotPasswordMutation.error as any)?.message ||
              'Failed to send reset email. Please try again.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || forgotPasswordMutation.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || forgotPasswordMutation.isPending
          ? 'Sending...'
          : 'Send reset instructions'}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to login
        </Link>
      </p>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useVerifyOTP, useResendOTP } from '@/lib/hooks/mutations/useVerifyOTP'

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type OTPFormData = z.infer<typeof otpSchema>

interface OTPVerificationFormProps {
  email: string
}

export function OTPVerificationForm({ email }: OTPVerificationFormProps) {
  const [showResendSuccess, setShowResendSuccess] = useState(false)
  const verifyMutation = useVerifyOTP()
  const resendMutation = useResendOTP()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  })

  const onSubmit = async (data: OTPFormData) => {
    try {
      await verifyMutation.mutateAsync({ email, otp: data.otp })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(email)
      setShowResendSuccess(true)
      setTimeout(() => setShowResendSuccess(false), 5000)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          We sent a verification code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            {...register('otp')}
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>}
        </div>

        {verifyMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {(verifyMutation.error as any)?.message ||
                'Verification failed. Please check your code.'}
            </p>
          </div>
        )}

        {showResendSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">New verification code sent!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || verifyMutation.isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendMutation.isPending ? 'Sending...' : "Didn't receive code? Resend"}
        </button>
      </div>
    </div>
  )
}

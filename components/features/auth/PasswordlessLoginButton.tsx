'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePasswordlessInit, usePasswordlessVerify } from '@/lib/hooks/mutations/usePasswordlessAuth'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const tokenSchema = z.object({
  token: z.string().length(6, 'Token must be 6 characters'),
})

type EmailFormData = z.infer<typeof emailSchema>
type TokenFormData = z.infer<typeof tokenSchema>

export function PasswordlessLoginButton() {
  const [step, setStep] = useState<'email' | 'token'>('email')
  const [email, setEmail] = useState('')
  const initMutation = usePasswordlessInit()
  const verifyMutation = usePasswordlessVerify()

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const tokenForm = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
  })

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      await initMutation.mutateAsync(data)
      setEmail(data.email)
      setStep('token')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleTokenSubmit = async (data: TokenFormData) => {
    try {
      await verifyMutation.mutateAsync({ email, token: data.token })
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (step === 'token') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          We sent a login link to <strong>{email}</strong>
        </p>
        <form onSubmit={tokenForm.handleSubmit(handleTokenSubmit)} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Login Code
            </label>
            <input
              {...tokenForm.register('token')}
              id="token"
              type="text"
              maxLength={6}
              placeholder="000000"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-lg tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {tokenForm.formState.errors.token && (
              <p className="mt-1 text-sm text-red-600">
                {tokenForm.formState.errors.token.message}
              </p>
            )}
          </div>

          {verifyMutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {(verifyMutation.error as any)?.message || 'Verification failed'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify & Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-blue-600 hover:text-blue-500"
          >
            Use a different email
          </button>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          {...emailForm.register('email')}
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {emailForm.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {emailForm.formState.errors.email.message}
          </p>
        )}
      </div>

      {initMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(initMutation.error as any)?.message || 'Failed to send login code'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={initMutation.isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {initMutation.isPending ? 'Sending...' : 'Send Login Code'}
      </button>
    </form>
  )
}

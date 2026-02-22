'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { withdrawalsAPI } from '@/lib/api/endpoints/withdrawals'

const withdrawalSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Amount is required' })
    .positive('Amount must be greater than 0'),
  payment_method: z.enum(['bank_transfer', 'paypal', 'crypto'], {
    required_error: 'Select a payment method',
  }),
  payment_details_text: z.string().min(1, 'Payment details are required'),
})

type WithdrawalFormData = z.infer<typeof withdrawalSchema>

interface WithdrawalRequestFormProps {
  onSuccess?: () => void
}

export function WithdrawalRequestForm({ onSuccess }: WithdrawalRequestFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: undefined,
      payment_method: undefined,
      payment_details_text: '',
    },
  })

  const onSubmit = async (data: WithdrawalFormData) => {
    setSubmitting(true)
    setError('')
    setSuccess(false)
    try {
      await withdrawalsAPI.create({
        amount: data.amount,
        payment_method: data.payment_method,
        payment_details: { info: data.payment_details_text },
      })
      setSuccess(true)
      reset()
      onSuccess?.()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit withdrawal request'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Request Withdrawal</h3>
      <p className="mt-1 text-sm text-gray-600">
        Submit a request to withdraw your available commission balance.
      </p>

      {success && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          Withdrawal request submitted successfully.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="payment_method"
            {...register('payment_method')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a method</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Crypto</option>
          </select>
          {errors.payment_method && (
            <p className="mt-1 text-xs text-red-600">{errors.payment_method.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="payment_details_text" className="block text-sm font-medium text-gray-700">
            Payment Details
          </label>
          <textarea
            id="payment_details_text"
            rows={3}
            {...register('payment_details_text')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your payment details (e.g., bank account number, PayPal email, wallet address)"
          />
          {errors.payment_details_text && (
            <p className="mt-1 text-xs text-red-600">{errors.payment_details_text.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}

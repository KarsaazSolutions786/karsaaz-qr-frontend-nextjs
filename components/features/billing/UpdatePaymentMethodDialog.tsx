'use client'

import { useState } from 'react'
import { X, CreditCard, Loader2 } from 'lucide-react'
import { useUpdatePaymentMethod } from '@/lib/hooks/mutations/useUpdatePaymentMethod'

interface UpdatePaymentMethodDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * T231 + T234: Modal dialog for updating payment method.
 *
 * NOTE: For full Stripe Elements integration, install @stripe/stripe-js
 * and @stripe/react-stripe-js, then replace the manual card fields with
 * <CardElement /> from Stripe. See: https://stripe.com/docs/stripe-js/react
 *
 * TODO: Integrate Stripe Elements when @stripe/stripe-js is added to dependencies.
 */
export function UpdatePaymentMethodDialog({
  open,
  onClose,
  onSuccess,
}: UpdatePaymentMethodDialogProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const updateMutation = useUpdatePaymentMethod()

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!cardNumber || !expiry || !cvc || !cardholderName) {
      setError('Please fill in all fields.')
      return
    }

    try {
      // TODO: When Stripe.js is available, use stripe.createPaymentMethod()
      // to tokenize the card and send the paymentMethodId instead.
      await updateMutation.mutateAsync('pm_placeholder')
      onSuccess?.()
      onClose()
    } catch {
      setError('Failed to update payment method. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Update Payment Method</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value)}
              placeholder="John Doe"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="4242 4242 4242 4242"
              maxLength={16}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                placeholder="MM/YY"
                maxLength={5}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Payment Method'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import type { PaymentMethod } from '@/types/entities/transaction'

interface PaymentMethodsListProps {
  methods: PaymentMethod[]
  onRemove: (id: string) => void
}

const brandIcons: Record<string, string> = {
  visa: '💳 Visa',
  mastercard: '💳 Mastercard',
  amex: '💳 Amex',
  discover: '💳 Discover',
}

export default function PaymentMethodsList({ methods, onRemove }: PaymentMethodsListProps) {
  if (methods.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No payment methods saved.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <div
          key={method.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className="text-lg">
              {method.brand ? (brandIcons[method.brand.toLowerCase()] ?? `💳 ${method.brand}`) : '💳'}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {method.type === 'card'
                  ? `•••• •••• •••• ${method.last4 ?? '****'}`
                  : method.type === 'paypal'
                    ? 'PayPal'
                    : 'Bank Account'}
              </p>
              {method.expiryMonth && method.expiryYear && (
                <p className="text-xs text-gray-500">
                  Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                </p>
              )}
            </div>
            {method.isDefault && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Default
              </span>
            )}
          </div>

          <button
            onClick={() => onRemove(method.id)}
            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { paymentGatewaysAPI } from '@/lib/api/endpoints/payment-gateways'
import PaymentGatewayForm from '@/components/features/payment-gateway/PaymentGatewayForm'

export default function NewPaymentGatewayPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Parameters<typeof paymentGatewaysAPI.create>[0]) => {
    try {
      setSubmitting(true)
      setError(null)
      await paymentGatewaysAPI.create(data)
      router.push('/payment-gateways')
    } catch {
      setError('Failed to create payment gateway.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Payment Gateway</h1>
        <p className="mt-2 text-sm text-gray-600">Configure a new payment gateway integration.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <PaymentGatewayForm onSubmit={handleSubmit} isSubmitting={submitting} />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { paymentGatewaysAPI } from '@/lib/api/endpoints/payment-gateways'
import PaymentGatewayForm from '@/components/features/payment-gateway/PaymentGatewayForm'
import type { PaymentGateway } from '@/types/entities/payment-gateway'

export default function EditPaymentGatewayPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [gateway, setGateway] = useState<PaymentGateway | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await paymentGatewaysAPI.getById(id)
        setGateway(data)
      } catch {
        setError('Failed to load gateway.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetch()
  }, [id])

  const handleSubmit = async (data: Parameters<typeof paymentGatewaysAPI.update>[1]) => {
    try {
      setSubmitting(true)
      setError(null)
      await paymentGatewaysAPI.update(id, data)
      router.push('/payment-gateways')
    } catch {
      setError('Failed to update payment gateway.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  if (!gateway && !loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">Gateway not found.</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Payment Gateway</h1>
        <p className="mt-2 text-sm text-gray-600">Update gateway configuration for {gateway?.name}.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {gateway && (
        <PaymentGatewayForm
          initialData={gateway}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      )}
    </div>
  )
}

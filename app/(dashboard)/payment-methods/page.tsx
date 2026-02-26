'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiClient from '@/lib/api/client'
import PaymentMethodsList from '@/components/features/subscriptions/PaymentMethodsList'
import type { PaymentMethod } from '@/types/entities/transaction'

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMethods = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{ data: PaymentMethod[] }>('/payment-methods')
      setMethods(res.data.data ?? res.data as unknown as PaymentMethod[])
    } catch {
      setError('Failed to load payment methods.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMethods()
  }, [])

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this payment method?')) return
    try {
      await apiClient.delete(`/payment-methods/${id}`)
      setMethods((prev) => prev.filter((m) => m.id !== id))
    } catch {
      toast.error('Unable to remove payment method. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
        <p className="mt-2 text-sm text-gray-600">Manage your saved payment methods.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <PaymentMethodsList methods={methods} onRemove={handleRemove} />
      )}
    </div>
  )
}

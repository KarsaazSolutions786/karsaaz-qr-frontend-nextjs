'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { paymentGatewaysAPI } from '@/lib/api/endpoints/payment-gateways'
import PaymentGatewayList from '@/components/features/payment-gateway/PaymentGatewayList'
import type { PaymentGateway } from '@/types/entities/payment-gateway'

export default function PaymentGatewaysPage() {
  const router = useRouter()
  const [gateways, setGateways] = useState<PaymentGateway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGateways = async () => {
    try {
      setLoading(true)
      const res = await paymentGatewaysAPI.list()
      setGateways(res.data)
    } catch {
      setError('Failed to load payment gateways.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGateways()
  }, [])

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      await paymentGatewaysAPI.update(id, { enabled })
      setGateways((prev) => prev.map((gw) => (gw.id === id ? { ...gw, enabled } : gw)))
    } catch {
      toast.error('Unable to update gateway status. Please try again.')
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/payment-gateways/${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gateway?')) return
    try {
      await paymentGatewaysAPI.delete(id)
      setGateways((prev) => prev.filter((gw) => gw.id !== id))
    } catch {
      toast.error('Unable to delete gateway. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Gateways</h1>
          <p className="mt-2 text-sm text-gray-600">Manage payment gateway configurations.</p>
        </div>
        <button
          onClick={() => router.push('/payment-gateways/new')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Add Gateway
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <PaymentGatewayList
          gateways={gateways}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

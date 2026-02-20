'use client'

import { useState, useEffect } from 'react'
import {
  getPaymentProcessors,
  updatePaymentProcessor,
  type PaymentProcessor,
} from '@/lib/api/endpoints/paypal'
import { PayPalConfigForm } from '@/components/features/payment-processors/PayPalConfigForm'

interface ProcessorUI {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
  slug: string
  configurable: boolean
  settings?: Record<string, string>
}

const DEFAULT_PROCESSORS: ProcessorUI[] = [
  {
    id: 'stripe', slug: 'stripe', name: 'Stripe',
    description: 'Accept credit cards, debit cards, and other payment methods via Stripe.',
    enabled: false, icon: '💳', configurable: false,
  },
  {
    id: 'paypal', slug: 'paypal', name: 'PayPal',
    description: 'Enable PayPal checkout for customers with PayPal accounts.',
    enabled: false, icon: '🅿️', configurable: true,
  },
  {
    id: 'razorpay', slug: 'razorpay', name: 'Razorpay',
    description: 'Accept payments via UPI, cards, netbanking, and wallets in India.',
    enabled: false, icon: '🏦', configurable: false,
  },
  {
    id: 'bank_transfer', slug: 'bank_transfer', name: 'Bank Transfer',
    description: 'Allow customers to pay via direct bank transfer or wire.',
    enabled: false, icon: '🏧', configurable: false,
  },
  {
    id: 'crypto', slug: 'crypto', name: 'Cryptocurrency',
    description: 'Accept Bitcoin, Ethereum, and other crypto payments.',
    enabled: false, icon: '₿', configurable: false,
  },
]

export default function PaymentProcessorsPage() {
  const [processors, setProcessors] = useState<ProcessorUI[]>(DEFAULT_PROCESSORS)
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    getPaymentProcessors()
      .then(({ data }) => {
        if (!Array.isArray(data)) return
        setProcessors((prev) =>
          prev.map((p) => {
            const backend = data.find((bp: PaymentProcessor) => bp.slug === p.slug)
            if (backend) {
              return { ...p, enabled: backend.is_enabled, settings: backend.settings }
            }
            return p
          })
        )
      })
      .catch(() => {})
  }, [])

  const toggleProcessor = async (slug: string) => {
    const proc = processors.find((p) => p.slug === slug)
    if (!proc) return

    setTogglingId(slug)
    try {
      await updatePaymentProcessor(slug, { is_enabled: !proc.enabled })
      setProcessors((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, enabled: !p.enabled } : p))
      )
    } catch {
      // Failed
    } finally {
      setTogglingId(null)
    }
  }

  const handlePayPalSave = async (values: Record<string, string>) => {
    await updatePaymentProcessor('paypal', { settings: values })
    setProcessors((prev) =>
      prev.map((p) => (p.slug === 'paypal' ? { ...p, settings: values } : p))
    )
    setConfiguring(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Processors</h1>
          <p className="mt-2 text-sm text-gray-600">Configure payment gateways</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {processors.map((processor) => (
          <div
            key={processor.id}
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{processor.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{processor.name}</h3>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    processor.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {processor.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">{processor.description}</p>

              {/* Config form */}
              {configuring === processor.slug && processor.slug === 'paypal' && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <PayPalConfigForm
                    initialValues={processor.settings as any}
                    onSave={handlePayPalSave}
                  />
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleProcessor(processor.slug)}
                  disabled={togglingId === processor.slug}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                    processor.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      processor.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                {processor.configurable && (
                  <button
                    onClick={() => setConfiguring(configuring === processor.slug ? null : processor.slug)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    {configuring === processor.slug ? 'Close' : 'Configure'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

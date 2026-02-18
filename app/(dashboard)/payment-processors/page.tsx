'use client'

import { useState } from 'react'

interface Processor {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
}

const initialProcessors: Processor[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept credit cards, debit cards, and other payment methods via Stripe.',
    enabled: false,
    icon: '💳',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Enable PayPal checkout for customers with PayPal accounts.',
    enabled: false,
    icon: '🅿️',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Accept payments via UPI, cards, netbanking, and wallets in India.',
    enabled: false,
    icon: '🏦',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Allow customers to pay via direct bank transfer or wire.',
    enabled: false,
    icon: '🏧',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Accept Bitcoin, Ethereum, and other crypto payments.',
    enabled: false,
    icon: '₿',
  },
]

export default function PaymentProcessorsPage() {
  const [processors, setProcessors] = useState<Processor[]>(initialProcessors)

  const toggleProcessor = (id: string) => {
    setProcessors((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
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
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  onClick={() => toggleProcessor(processor.id)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    processor.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      processor.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  getCustomerPortalUrl,
  getPaymentMethods,
  setDefaultPaymentMethod,
  removePaymentMethod,
  type StripePaymentMethod,
} from '@/lib/api/endpoints/stripe'
import { CreditCard, ExternalLink, Trash2, Star } from 'lucide-react'

export function StripeCustomerPortal() {
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  async function loadPaymentMethods() {
    try {
      const { data } = await getPaymentMethods()
      setPaymentMethods(Array.isArray(data) ? data : [])
    } catch {
      setPaymentMethods([])
    } finally {
      setLoading(false)
    }
  }

  async function handleOpenPortal() {
    setPortalLoading(true)
    try {
      const { data } = await getCustomerPortalUrl()
      if (data?.url) window.open(data.url, '_blank')
    } catch {
      // Portal not available
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleSetDefault(id: string) {
    setActionLoading(id)
    try {
      await setDefaultPaymentMethod(id)
      await loadPaymentMethods()
    } catch {
      // Failed
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this payment method?')) return
    setActionLoading(id)
    try {
      await removePaymentMethod(id)
      await loadPaymentMethods()
    } catch {
      // Failed
    } finally {
      setActionLoading(null)
    }
  }

  const brandIcons: Record<string, string> = {
    visa: '💳 Visa',
    mastercard: '💳 Mastercard',
    amex: '💳 Amex',
    discover: '💳 Discover',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Stripe Billing Management</h3>
        <button
          onClick={handleOpenPortal}
          disabled={portalLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {portalLoading ? 'Opening...' : 'Open Billing Portal'}
        </button>
      </div>

      {/* Payment Methods */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Payment Methods</h4>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
            Loading...
          </div>
        ) : paymentMethods.length === 0 ? (
          <p className="text-sm text-gray-500">No payment methods on file.</p>
        ) : (
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {brandIcons[pm.brand.toLowerCase()] || `💳 ${pm.brand}`} •••• {pm.last4}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {pm.exp_month.toString().padStart(2, '0')}/{pm.exp_year}
                    </span>
                  </div>
                  {pm.is_default && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!pm.is_default && (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      disabled={actionLoading === pm.id}
                      className="p-1.5 text-gray-400 hover:text-purple-600 disabled:opacity-50"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(pm.id)}
                    disabled={actionLoading === pm.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

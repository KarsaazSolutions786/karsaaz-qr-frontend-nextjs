'use client'

import { useState, useCallback } from 'react'
import {
  getCustomerPortalUrl,
  getPaymentMethods,
  getInvoices,
  setDefaultPaymentMethod,
  removePaymentMethod,
  StripePaymentMethod,
  StripeInvoice,
} from '@/lib/api/endpoints/stripe'

function formatAmount(amount: number, currency?: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').toUpperCase(),
  }).format(amount / 100)
}

function formatDate(timestamp: number | string): string {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp * 1000)
    : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  open: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-600',
  void: 'bg-red-100 text-red-600',
  uncollectible: 'bg-red-100 text-red-600',
}

export function BillingManagementCard() {
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>([])
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [pmLoading, setPmLoading] = useState(false)

  const [invoices, setInvoices] = useState<StripeInvoice[]>([])
  const [showInvoices, setShowInvoices] = useState(false)
  const [invLoading, setInvLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Open Stripe Customer Portal in new tab
  const handleOpenPortal = useCallback(async () => {
    setPortalLoading(true)
    setError(null)
    try {
      const response = await getCustomerPortalUrl()
      const data = response.data as any
      const url = data?.url || data?.portal_url
      if (url) {
        window.open(url, '_blank')
      } else {
        setError('Failed to open billing portal')
      }
    } catch {
      setError('Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }, [])

  // Load payment methods
  const handleLoadPaymentMethods = useCallback(async () => {
    if (showPaymentMethods) {
      setShowPaymentMethods(false)
      return
    }
    setPmLoading(true)
    setError(null)
    try {
      const response = await getPaymentMethods()
      const data = response.data as any
      const methods = data?.payment_methods || data?.data || data || []
      setPaymentMethods(Array.isArray(methods) ? methods : [])
      setShowPaymentMethods(true)
    } catch {
      setError('Failed to load payment methods')
    } finally {
      setPmLoading(false)
    }
  }, [showPaymentMethods])

  // Load invoices
  const handleLoadInvoices = useCallback(async () => {
    if (showInvoices) {
      setShowInvoices(false)
      return
    }
    setInvLoading(true)
    setError(null)
    try {
      const response = await getInvoices(20)
      const data = response.data as any
      const invList = data?.invoices || data?.data || data || []
      setInvoices(Array.isArray(invList) ? invList : [])
      setShowInvoices(true)
    } catch {
      setError('Failed to load invoices')
    } finally {
      setInvLoading(false)
    }
  }, [showInvoices])

  // Set default payment method
  const handleSetDefault = useCallback(async (pmId: string) => {
    setLoading(true)
    try {
      await setDefaultPaymentMethod(pmId)
      await handleLoadPaymentMethods()
    } catch {
      setError('Failed to update default payment method')
    } finally {
      setLoading(false)
    }
  }, [handleLoadPaymentMethods])

  // Remove payment method
  const handleRemove = useCallback(async (pmId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    setLoading(true)
    try {
      await removePaymentMethod(pmId)
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== pmId))
    } catch {
      setError('Failed to remove payment method')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Stripe Billing Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleOpenPortal}
            disabled={portalLoading}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {portalLoading ? (
              <Spinner />
            ) : (
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            )}
            Open Billing Portal
          </button>
          <button
            type="button"
            onClick={handleLoadPaymentMethods}
            disabled={pmLoading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {pmLoading ? <Spinner /> : (
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            )}
            Payment Methods
          </button>
          <button
            type="button"
            onClick={handleLoadInvoices}
            disabled={invLoading}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {invLoading ? <Spinner /> : (
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            )}
            Invoices
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Payment Methods Section */}
      {showPaymentMethods && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Methods</h3>
          {paymentMethods.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No payment methods found</p>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((pm) => {
                const isDefault = pm.is_default || (pm as any).customer?.invoice_settings?.default_payment_method === pm.id
                const brand = (pm as any).card?.brand || pm.brand || (pm as any).type || 'card'
                const last4 = (pm as any).card?.last4 || pm.last4 || '****'
                const expMonth = (pm as any).card?.exp_month || pm.exp_month
                const expYear = (pm as any).card?.exp_year || pm.exp_year

                return (
                  <div
                    key={pm.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border p-3 ${
                      isDefault ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold uppercase text-gray-800">{brand}</span>
                      <span className="text-sm text-gray-500">****{last4}</span>
                      {expMonth && expYear && (
                        <span className="text-xs text-gray-400">
                          {String(expMonth).padStart(2, '0')}/{String(expYear).slice(-2)}
                        </span>
                      )}
                      {isDefault && (
                        <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(pm.id)}
                          disabled={loading}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(pm.id)}
                        disabled={loading}
                        className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Invoices Section */}
      {showInvoices && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No invoices found</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => {
                const invNumber = (inv as any).number || inv.id
                const invDate = (inv as any).created || inv.date
                const invAmount = (inv as any).amount_paid || (inv as any).total || inv.amount || 0
                const invCurrency = inv.currency || 'usd'
                const invStatus = inv.status || 'unknown'
                const invUrl = inv.hosted_invoice_url || (inv as any).hosted_invoice_url
                const pdfUrl = inv.pdf_url || (inv as any).invoice_pdf

                return (
                  <div
                    key={inv.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-800">{invNumber}</span>
                      <span className="text-xs text-gray-400">{formatDate(invDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatAmount(invAmount, invCurrency)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase ${statusColors[invStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {invStatus}
                      </span>
                      {(invUrl || pdfUrl) && (
                        <a
                          href={invUrl || pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

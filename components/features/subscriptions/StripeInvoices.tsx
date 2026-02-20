'use client'

import { useState, useEffect } from 'react'
import { getInvoices, type StripeInvoice } from '@/lib/api/endpoints/stripe'
import { FileText, Download, ExternalLink } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  open: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  void: 'bg-red-100 text-red-700',
  uncollectible: 'bg-red-100 text-red-700',
}

const LIMIT_OPTIONS = [5, 10, 25, 50]

export function StripeInvoices() {
  const [invoices, setInvoices] = useState<StripeInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    loadInvoices()
  }, [limit])

  async function loadInvoices() {
    setLoading(true)
    try {
      const { data } = await getInvoices(limit)
      setInvoices(Array.isArray(data) ? data : [])
    } catch {
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Show:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-700"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoice List */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No invoices found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inv.number || inv.id}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(inv.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatAmount(inv.amount, inv.currency)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                    {inv.status}
                  </span>
                  <div className="flex gap-1">
                    {inv.pdf_url && (
                      <a
                        href={inv.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-purple-600"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    {inv.hosted_invoice_url && (
                      <a
                        href={inv.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-blue-600"
                        title="View"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

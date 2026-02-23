'use client'

import { useState, useCallback } from 'react'

interface CheckoutLinkGeneratorProps {
  planId: number
  planName: string
}

type BillingCycle = 'monthly' | 'annual'

export function CheckoutLinkGenerator({ planId, planName }: CheckoutLinkGeneratorProps) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const checkoutUrl = `${baseUrl}/checkout?plan=${planId}${cycle === 'annual' ? '&billing=annual' : ''}`

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(checkoutUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = checkoutUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }, [checkoutUrl])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Checkout Link</h3>
      <p className="mt-1 text-xs text-gray-500">
        Share this link to let users subscribe directly to <strong>{planName}</strong>.
      </p>

      {/* Billing cycle selector */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setCycle('monthly')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            cycle === 'monthly'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setCycle('annual')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            cycle === 'annual'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Annual
        </button>
      </div>

      {/* URL display + copy */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 overflow-hidden rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
          <p className="truncate font-mono text-xs text-gray-700">{checkoutUrl}</p>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

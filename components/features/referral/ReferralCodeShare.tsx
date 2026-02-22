'use client'

import { useEffect, useState } from 'react'
import { referralAPI } from '@/lib/api/endpoints/referral'

export function ReferralCodeShare() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    referralAPI
      .getCode()
      .then((res) => setCode(res.referral_code))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const referralLink =
    typeof window !== 'undefined' && code
      ? `${window.location.origin}/register?ref=${code}`
      : ''

  const handleCopy = async () => {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = referralLink
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-3 h-10 rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Your Referral Link</h3>
      <p className="mt-1 text-sm text-gray-600">
        Share this link with others. You&apos;ll earn a commission when they sign up.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {code && (
        <p className="mt-3 text-xs text-gray-500">
          Referral code: <span className="font-mono font-medium text-gray-700">{code}</span>
        </p>
      )}
    </div>
  )
}

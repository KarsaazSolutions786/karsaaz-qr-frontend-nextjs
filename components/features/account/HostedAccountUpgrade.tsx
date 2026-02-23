'use client'

import { useState } from 'react'
import Link from 'next/link'

interface HostedAccountUpgradeProps {
  currentPlan?: string
  onUpgradeClick?: () => void
}

export function HostedAccountUpgrade({ currentPlan, onUpgradeClick }: HostedAccountUpgradeProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Upgrade Your Plan</h3>
          {currentPlan && (
            <p className="mt-1 text-sm text-gray-500">
              Current plan: <span className="font-medium text-gray-700">{currentPlan}</span>
            </p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Unlock more QR codes, advanced analytics, custom domains, and priority support by
            upgrading to a higher plan.
          </p>

          <ul className="mt-4 space-y-2">
            {[
              'Unlimited dynamic QR codes',
              'Advanced scan analytics & exports',
              'Custom branded domains',
              'Priority email support',
            ].map(feature => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/pricing"
              onClick={onUpgradeClick}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              View Plans
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

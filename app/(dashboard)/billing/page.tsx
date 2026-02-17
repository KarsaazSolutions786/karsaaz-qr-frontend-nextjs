'use client'

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
        <p className="mt-2 text-sm text-gray-600">
          View your invoices and payment history
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Coming Soon Placeholder */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Billing Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Invoice history and payment methods will appear here
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Module ready - pending backend integration
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import type { ReactNode } from 'react'

interface PaymentProcessorFormBaseProps {
  slug: string
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
  children?: ReactNode
}

export default function PaymentProcessorFormBase({
  slug,
  settings,
  onChange,
  children,
}: PaymentProcessorFormBaseProps) {
  return (
    <div className="space-y-4">
      {/* API Key */}
      <div>
        <label htmlFor={`${slug}-api-key`} className="block text-sm font-medium text-gray-700">
          API Key
        </label>
        <input
          id={`${slug}-api-key`}
          type="password"
          value={settings.api_key ?? ''}
          onChange={(e) => onChange('api_key', e.target.value)}
          placeholder="Enter API key"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      {/* API Secret */}
      <div>
        <label htmlFor={`${slug}-api-secret`} className="block text-sm font-medium text-gray-700">
          API Secret
        </label>
        <input
          id={`${slug}-api-secret`}
          type="password"
          value={settings.api_secret ?? ''}
          onChange={(e) => onChange('api_secret', e.target.value)}
          placeholder="Enter API secret"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Mode */}
      <div>
        <label htmlFor={`${slug}-mode`} className="block text-sm font-medium text-gray-700">
          Mode
        </label>
        <select
          id={`${slug}-mode`}
          value={settings.mode ?? 'sandbox'}
          onChange={(e) => onChange('mode', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        >
          <option value="sandbox">Sandbox</option>
          <option value="live">Live</option>
        </select>
      </div>

      {/* Webhook URL (read-only display) */}
      {settings.webhook_url && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={settings.webhook_url}
              className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(settings.webhook_url ?? '')}
              className="flex-shrink-0 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Processor-specific fields */}
      {children}
    </div>
  )
}

'use client'

import { useState } from 'react'

interface PayPalConfigFormProps {
  initialValues?: {
    paypal_mode?: string
    paypal_client_id?: string
    paypal_client_secret?: string
  }
  onSave: (values: {
    paypal_mode: string
    paypal_client_id: string
    paypal_client_secret: string
  }) => Promise<void>
}

export function PayPalConfigForm({ initialValues, onSave }: PayPalConfigFormProps) {
  const [mode, setMode] = useState(initialValues?.paypal_mode || 'sandbox')
  const [clientId, setClientId] = useState(initialValues?.paypal_client_id || '')
  const [clientSecret, setClientSecret] = useState(initialValues?.paypal_client_secret || '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        paypal_mode: mode,
        paypal_client_id: clientId,
        paypal_client_secret: clientSecret,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
        >
          <option value="sandbox">Sandbox (Testing)</option>
          <option value="live">Live (Production)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Client ID</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="PayPal Client ID"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Client Secret</label>
        <input
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="PayPal Client Secret"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  )
}

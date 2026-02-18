'use client'

import { useState } from 'react'

interface SmsProvider {
  id: string
  name: string
  description: string
  enabled: boolean
  apiKey: string
  apiSecret: string
}

const initialProviders: SmsProvider[] = [
  { id: 'twilio', name: 'Twilio', description: 'Programmable SMS with global reach and reliable delivery', enabled: true, apiKey: 'ACxxxxxxxxxxxxxxxxxxxxx', apiSecret: '' },
  { id: 'vonage', name: 'Nexmo / Vonage', description: 'Enterprise-grade SMS API with smart routing', enabled: false, apiKey: '', apiSecret: '' },
  { id: 'messagebird', name: 'MessageBird', description: 'Omnichannel messaging platform with high throughput', enabled: false, apiKey: '', apiSecret: '' },
  { id: 'custom', name: 'Custom Gateway', description: 'Connect your own SMS gateway via webhook URL', enabled: false, apiKey: '', apiSecret: '' },
]

export default function SmsPortalsPage() {
  const [providers, setProviders] = useState<SmsProvider[]>(initialProviders)
  const [saved, setSaved] = useState(false)

  const updateProvider = (id: string, field: keyof SmsProvider, value: string | boolean) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SMS Portals</h1>
        <p className="mt-2 text-sm text-gray-600">Configure SMS gateway providers</p>
      </div>

      <div className="mt-8 space-y-6">
        {providers.map((provider) => (
          <div key={provider.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{provider.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{provider.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateProvider(provider.id, 'enabled', !provider.enabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${provider.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${provider.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
            {provider.enabled && (
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {provider.id === 'custom' ? 'Webhook URL' : 'API Key / SID'}
                    </label>
                    <input
                      type="text"
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(provider.id, 'apiKey', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {provider.id === 'custom' ? 'Auth Token' : 'API Secret / Auth Token'}
                    </label>
                    <input
                      type="password"
                      value={provider.apiSecret}
                      onChange={(e) => updateProvider(provider.id, 'apiSecret', e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">SMS settings saved successfully!</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}

'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function XenditForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="xendit" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="xendit-secret-api-key" className="block text-sm font-medium text-gray-700">
          Secret API Key
        </label>
        <input
          id="xendit-secret-api-key"
          type="password"
          value={settings.secret_api_key ?? ''}
          onChange={(e) => onChange('secret_api_key', e.target.value)}
          placeholder="Enter Secret API Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="xendit-public-api-key" className="block text-sm font-medium text-gray-700">
          Public API Key
        </label>
        <input
          id="xendit-public-api-key"
          type="text"
          value={settings.public_api_key ?? ''}
          onChange={(e) => onChange('public_api_key', e.target.value)}
          placeholder="Enter Public API Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="xendit-callback-token" className="block text-sm font-medium text-gray-700">
          Callback Token
        </label>
        <input
          id="xendit-callback-token"
          type="password"
          value={settings.callback_token ?? ''}
          onChange={(e) => onChange('callback_token', e.target.value)}
          placeholder="Enter Callback Token"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

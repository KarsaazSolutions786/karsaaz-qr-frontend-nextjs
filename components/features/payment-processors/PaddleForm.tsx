'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PaddleForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="paddle" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="paddle-vendor-id" className="block text-sm font-medium text-gray-700">
          Vendor ID
        </label>
        <input
          id="paddle-vendor-id"
          type="text"
          value={settings.vendor_id ?? ''}
          onChange={(e) => onChange('vendor_id', e.target.value)}
          placeholder="Enter Vendor ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="paddle-auth-code" className="block text-sm font-medium text-gray-700">
          Auth Code
        </label>
        <input
          id="paddle-auth-code"
          type="password"
          value={settings.auth_code ?? ''}
          onChange={(e) => onChange('auth_code', e.target.value)}
          placeholder="Enter Auth Code"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="paddle-public-key" className="block text-sm font-medium text-gray-700">
          Public Key
        </label>
        <input
          id="paddle-public-key"
          type="text"
          value={settings.public_key ?? ''}
          onChange={(e) => onChange('public_key', e.target.value)}
          placeholder="Enter Public Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

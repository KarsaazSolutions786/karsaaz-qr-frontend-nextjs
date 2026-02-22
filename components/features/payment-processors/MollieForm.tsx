'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function MollieForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="mollie" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="mollie-api-key" className="block text-sm font-medium text-gray-700">
          API Key
        </label>
        <input
          id="mollie-api-key"
          type="password"
          value={settings.api_key ?? ''}
          onChange={(e) => onChange('api_key', e.target.value)}
          placeholder="Enter API Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

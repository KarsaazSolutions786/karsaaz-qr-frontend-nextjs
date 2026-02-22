'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayStackForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="paystack" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="paystack-secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key
        </label>
        <input
          id="paystack-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={(e) => onChange('secret_key', e.target.value)}
          placeholder="Enter Secret Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="paystack-public-key" className="block text-sm font-medium text-gray-700">
          Public Key
        </label>
        <input
          id="paystack-public-key"
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

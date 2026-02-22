'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function TwoCheckoutForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="2checkout" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="2co-merchant-code" className="block text-sm font-medium text-gray-700">
          Merchant Code
        </label>
        <input
          id="2co-merchant-code"
          type="text"
          value={settings.merchant_code ?? ''}
          onChange={(e) => onChange('merchant_code', e.target.value)}
          placeholder="Enter Merchant Code"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="2co-secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key
        </label>
        <input
          id="2co-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={(e) => onChange('secret_key', e.target.value)}
          placeholder="Enter Secret Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="2co-publishable-key" className="block text-sm font-medium text-gray-700">
          Publishable Key
        </label>
        <input
          id="2co-publishable-key"
          type="text"
          value={settings.publishable_key ?? ''}
          onChange={(e) => onChange('publishable_key', e.target.value)}
          placeholder="Enter Publishable Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayUInternationalForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="payu-international" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="payu-intl-merchant-key" className="block text-sm font-medium text-gray-700">
          Merchant Key
        </label>
        <input
          id="payu-intl-merchant-key"
          type="text"
          value={settings.merchant_key ?? ''}
          onChange={(e) => onChange('merchant_key', e.target.value)}
          placeholder="Enter Merchant Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payu-intl-merchant-salt" className="block text-sm font-medium text-gray-700">
          Merchant Salt
        </label>
        <input
          id="payu-intl-merchant-salt"
          type="password"
          value={settings.merchant_salt ?? ''}
          onChange={(e) => onChange('merchant_salt', e.target.value)}
          placeholder="Enter Merchant Salt"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payu-intl-auth-header" className="block text-sm font-medium text-gray-700">
          Auth Header
        </label>
        <input
          id="payu-intl-auth-header"
          type="password"
          value={settings.auth_header ?? ''}
          onChange={(e) => onChange('auth_header', e.target.value)}
          placeholder="Enter Auth Header"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

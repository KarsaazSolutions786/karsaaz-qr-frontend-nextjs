'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayULatamForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="payu-latam" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="payu-latam-api-key" className="block text-sm font-medium text-gray-700">
          API Key
        </label>
        <input
          id="payu-latam-api-key"
          type="password"
          value={settings.api_key ?? ''}
          onChange={(e) => onChange('api_key', e.target.value)}
          placeholder="Enter API Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payu-latam-api-login" className="block text-sm font-medium text-gray-700">
          API Login
        </label>
        <input
          id="payu-latam-api-login"
          type="text"
          value={settings.api_login ?? ''}
          onChange={(e) => onChange('api_login', e.target.value)}
          placeholder="Enter API Login"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payu-latam-merchant-id" className="block text-sm font-medium text-gray-700">
          Merchant ID
        </label>
        <input
          id="payu-latam-merchant-id"
          type="text"
          value={settings.merchant_id ?? ''}
          onChange={(e) => onChange('merchant_id', e.target.value)}
          placeholder="Enter Merchant ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payu-latam-account-id" className="block text-sm font-medium text-gray-700">
          Account ID
        </label>
        <input
          id="payu-latam-account-id"
          type="text"
          value={settings.account_id ?? ''}
          onChange={(e) => onChange('account_id', e.target.value)}
          placeholder="Enter Account ID"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

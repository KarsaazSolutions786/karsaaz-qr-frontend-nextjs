'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayTRForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="paytr" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="paytr-merchant-id" className="block text-sm font-medium text-gray-700">
          Merchant ID
        </label>
        <input
          id="paytr-merchant-id"
          type="text"
          value={settings.merchant_id ?? ''}
          onChange={(e) => onChange('merchant_id', e.target.value)}
          placeholder="Enter Merchant ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="paytr-merchant-key" className="block text-sm font-medium text-gray-700">
          Merchant Key
        </label>
        <input
          id="paytr-merchant-key"
          type="password"
          value={settings.merchant_key ?? ''}
          onChange={(e) => onChange('merchant_key', e.target.value)}
          placeholder="Enter Merchant Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="paytr-merchant-salt" className="block text-sm font-medium text-gray-700">
          Merchant Salt
        </label>
        <input
          id="paytr-merchant-salt"
          type="password"
          value={settings.merchant_salt ?? ''}
          onChange={(e) => onChange('merchant_salt', e.target.value)}
          placeholder="Enter Merchant Salt"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

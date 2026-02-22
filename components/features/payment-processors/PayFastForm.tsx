'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayFastForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="payfast" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="payfast-merchant-id" className="block text-sm font-medium text-gray-700">
          Merchant ID
        </label>
        <input
          id="payfast-merchant-id"
          type="text"
          value={settings.merchant_id ?? ''}
          onChange={(e) => onChange('merchant_id', e.target.value)}
          placeholder="Enter Merchant ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payfast-merchant-key" className="block text-sm font-medium text-gray-700">
          Merchant Key
        </label>
        <input
          id="payfast-merchant-key"
          type="password"
          value={settings.merchant_key ?? ''}
          onChange={(e) => onChange('merchant_key', e.target.value)}
          placeholder="Enter Merchant Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="payfast-passphrase" className="block text-sm font-medium text-gray-700">
          Passphrase
        </label>
        <input
          id="payfast-passphrase"
          type="password"
          value={settings.passphrase ?? ''}
          onChange={(e) => onChange('passphrase', e.target.value)}
          placeholder="Enter Passphrase"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

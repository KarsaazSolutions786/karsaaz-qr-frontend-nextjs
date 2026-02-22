'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function FlutterwaveForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="flutterwave" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="flutterwave-public-key" className="block text-sm font-medium text-gray-700">
          Public Key
        </label>
        <input
          id="flutterwave-public-key"
          type="text"
          value={settings.public_key ?? ''}
          onChange={(e) => onChange('public_key', e.target.value)}
          placeholder="Enter Public Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="flutterwave-secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key
        </label>
        <input
          id="flutterwave-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={(e) => onChange('secret_key', e.target.value)}
          placeholder="Enter Secret Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="flutterwave-encryption-key" className="block text-sm font-medium text-gray-700">
          Encryption Key
        </label>
        <input
          id="flutterwave-encryption-key"
          type="password"
          value={settings.encryption_key ?? ''}
          onChange={(e) => onChange('encryption_key', e.target.value)}
          placeholder="Enter Encryption Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

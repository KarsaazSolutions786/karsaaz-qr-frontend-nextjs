'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function YookassaForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="yookassa" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="yookassa-shop-id" className="block text-sm font-medium text-gray-700">
          Shop ID
        </label>
        <input
          id="yookassa-shop-id"
          type="text"
          value={settings.shop_id ?? ''}
          onChange={(e) => onChange('shop_id', e.target.value)}
          placeholder="Enter Shop ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="yookassa-secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key
        </label>
        <input
          id="yookassa-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={(e) => onChange('secret_key', e.target.value)}
          placeholder="Enter Secret Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

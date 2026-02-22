'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function MercadoPagoForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="mercadopago" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="mercadopago-public-key" className="block text-sm font-medium text-gray-700">
          Public Key
        </label>
        <input
          id="mercadopago-public-key"
          type="text"
          value={settings.public_key ?? ''}
          onChange={(e) => onChange('public_key', e.target.value)}
          placeholder="Enter Public Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="mercadopago-access-token" className="block text-sm font-medium text-gray-700">
          Access Token
        </label>
        <input
          id="mercadopago-access-token"
          type="password"
          value={settings.access_token ?? ''}
          onChange={(e) => onChange('access_token', e.target.value)}
          placeholder="Enter Access Token"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

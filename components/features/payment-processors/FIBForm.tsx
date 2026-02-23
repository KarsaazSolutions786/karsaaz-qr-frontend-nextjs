'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function FIBForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="fib" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="fib-client-id" className="block text-sm font-medium text-gray-700">
          Client ID
        </label>
        <input
          id="fib-client-id"
          type="text"
          value={settings.client_id ?? ''}
          onChange={e => onChange('client_id', e.target.value)}
          placeholder="Enter Client ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="fib-client-secret" className="block text-sm font-medium text-gray-700">
          Client Secret
        </label>
        <input
          id="fib-client-secret"
          type="password"
          value={settings.client_secret ?? ''}
          onChange={e => onChange('client_secret', e.target.value)}
          placeholder="Enter Client Secret"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="fib-merchant-id" className="block text-sm font-medium text-gray-700">
          Merchant ID
        </label>
        <input
          id="fib-merchant-id"
          type="text"
          value={settings.merchant_id ?? ''}
          onChange={e => onChange('merchant_id', e.target.value)}
          placeholder="Enter Merchant ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="fib-callback-url" className="block text-sm font-medium text-gray-700">
          Callback URL
        </label>
        <input
          id="fib-callback-url"
          type="text"
          value={settings.callback_url ?? ''}
          onChange={e => onChange('callback_url', e.target.value)}
          placeholder="https://example.com/api/webhooks/fib"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="fib-mode" className="block text-sm font-medium text-gray-700">
          Mode
        </label>
        <select
          id="fib-mode"
          value={settings.mode ?? 'staging'}
          onChange={e => onChange('mode', e.target.value)}
          className={inputClass}
        >
          <option value="staging">Test (Staging)</option>
          <option value="production">Live (Production)</option>
        </select>
      </div>
    </PaymentProcessorFormBase>
  )
}

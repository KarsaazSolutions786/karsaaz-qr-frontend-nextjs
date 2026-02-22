'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function DinteroForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="dintero" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="dintero-client-id" className="block text-sm font-medium text-gray-700">
          Client ID
        </label>
        <input
          id="dintero-client-id"
          type="text"
          value={settings.client_id ?? ''}
          onChange={(e) => onChange('client_id', e.target.value)}
          placeholder="Enter Client ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="dintero-client-secret" className="block text-sm font-medium text-gray-700">
          Client Secret
        </label>
        <input
          id="dintero-client-secret"
          type="password"
          value={settings.client_secret ?? ''}
          onChange={(e) => onChange('client_secret', e.target.value)}
          placeholder="Enter Client Secret"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="dintero-account-id" className="block text-sm font-medium text-gray-700">
          Account ID
        </label>
        <input
          id="dintero-account-id"
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

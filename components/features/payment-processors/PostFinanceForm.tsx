'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PostFinanceForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="postfinance" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="postfinance-space-id" className="block text-sm font-medium text-gray-700">
          Space ID
        </label>
        <input
          id="postfinance-space-id"
          type="text"
          value={settings.space_id ?? ''}
          onChange={(e) => onChange('space_id', e.target.value)}
          placeholder="Enter Space ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="postfinance-user-id" className="block text-sm font-medium text-gray-700">
          User ID
        </label>
        <input
          id="postfinance-user-id"
          type="text"
          value={settings.user_id ?? ''}
          onChange={(e) => onChange('user_id', e.target.value)}
          placeholder="Enter User ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="postfinance-api-secret" className="block text-sm font-medium text-gray-700">
          API Secret
        </label>
        <input
          id="postfinance-api-secret"
          type="password"
          value={settings.api_secret ?? ''}
          onChange={(e) => onChange('api_secret', e.target.value)}
          placeholder="Enter API Secret"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

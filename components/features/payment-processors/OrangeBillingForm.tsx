'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function OrangeBillingForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="orange-billing" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="orange-merchant-key" className="block text-sm font-medium text-gray-700">
          Merchant Key
        </label>
        <input
          id="orange-merchant-key"
          type="password"
          value={settings.merchant_key ?? ''}
          onChange={e => onChange('merchant_key', e.target.value)}
          placeholder="Enter Merchant Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="orange-api-url" className="block text-sm font-medium text-gray-700">
          API URL
        </label>
        <input
          id="orange-api-url"
          type="text"
          value={settings.api_url ?? ''}
          onChange={e => onChange('api_url', e.target.value)}
          placeholder="Enter API URL"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="orange-return-url" className="block text-sm font-medium text-gray-700">
          Return URL
        </label>
        <input
          id="orange-return-url"
          type="text"
          value={settings.return_url ?? ''}
          onChange={e => onChange('return_url', e.target.value)}
          placeholder="Enter Return URL"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="orange-cancel-url" className="block text-sm font-medium text-gray-700">
          Cancel URL
        </label>
        <input
          id="orange-cancel-url"
          type="text"
          value={settings.cancel_url ?? ''}
          onChange={e => onChange('cancel_url', e.target.value)}
          placeholder="Enter Cancel URL"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="orange-country-code" className="block text-sm font-medium text-gray-700">
          Country Code
        </label>
        <input
          id="orange-country-code"
          type="text"
          value={settings.country_code ?? ''}
          onChange={e => onChange('country_code', e.target.value)}
          placeholder="e.g. BF, CI, SN"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="orange-currency" className="block text-sm font-medium text-gray-700">
          Currency
        </label>
        <input
          id="orange-currency"
          type="text"
          value={settings.currency ?? ''}
          onChange={e => onChange('currency', e.target.value)}
          placeholder="e.g. XOF"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

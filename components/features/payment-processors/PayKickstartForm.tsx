'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function PayKickstartForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="paykickstart" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="paykickstart-api-key" className="block text-sm font-medium text-gray-700">
          API Key
        </label>
        <input
          id="paykickstart-api-key"
          type="password"
          value={settings.api_key ?? ''}
          onChange={e => onChange('api_key', e.target.value)}
          placeholder="Enter API Key"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="paykickstart-secret-key"
          className="block text-sm font-medium text-gray-700"
        >
          Secret Key
        </label>
        <input
          id="paykickstart-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={e => onChange('secret_key', e.target.value)}
          placeholder="Enter Secret Key"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="paykickstart-campaign-id"
          className="block text-sm font-medium text-gray-700"
        >
          Campaign ID
        </label>
        <input
          id="paykickstart-campaign-id"
          type="text"
          value={settings.campaign_id ?? ''}
          onChange={e => onChange('campaign_id', e.target.value)}
          placeholder="Enter Campaign ID"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="paykickstart-webhook-url"
          className="block text-sm font-medium text-gray-700"
        >
          Webhook URL
        </label>
        <input
          id="paykickstart-webhook-url"
          type="text"
          value={settings.webhook_url ?? ''}
          onChange={e => onChange('webhook_url', e.target.value)}
          placeholder="https://example.com/api/webhooks/paykickstart"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

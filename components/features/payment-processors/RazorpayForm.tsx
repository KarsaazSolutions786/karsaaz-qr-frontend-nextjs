'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function RazorpayForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="razorpay" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="razorpay-key-id" className="block text-sm font-medium text-gray-700">
          Key ID
        </label>
        <input
          id="razorpay-key-id"
          type="text"
          value={settings.key_id ?? ''}
          onChange={(e) => onChange('key_id', e.target.value)}
          placeholder="Enter Key ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="razorpay-key-secret" className="block text-sm font-medium text-gray-700">
          Key Secret
        </label>
        <input
          id="razorpay-key-secret"
          type="password"
          value={settings.key_secret ?? ''}
          onChange={(e) => onChange('key_secret', e.target.value)}
          placeholder="Enter Key Secret"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="razorpay-webhook-secret" className="block text-sm font-medium text-gray-700">
          Webhook Secret
        </label>
        <input
          id="razorpay-webhook-secret"
          type="password"
          value={settings.webhook_secret ?? ''}
          onChange={(e) => onChange('webhook_secret', e.target.value)}
          placeholder="Enter Webhook Secret"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

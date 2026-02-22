'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function AlipayForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="alipay" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="alipay-app-id" className="block text-sm font-medium text-gray-700">
          App ID
        </label>
        <input
          id="alipay-app-id"
          type="text"
          value={settings.app_id ?? ''}
          onChange={(e) => onChange('app_id', e.target.value)}
          placeholder="Enter App ID"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="alipay-private-key" className="block text-sm font-medium text-gray-700">
          Private Key
        </label>
        <input
          id="alipay-private-key"
          type="password"
          value={settings.private_key ?? ''}
          onChange={(e) => onChange('private_key', e.target.value)}
          placeholder="Enter Private Key"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="alipay-public-key" className="block text-sm font-medium text-gray-700">
          Alipay Public Key
        </label>
        <input
          id="alipay-public-key"
          type="text"
          value={settings.alipay_public_key ?? ''}
          onChange={(e) => onChange('alipay_public_key', e.target.value)}
          placeholder="Enter Alipay Public Key"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

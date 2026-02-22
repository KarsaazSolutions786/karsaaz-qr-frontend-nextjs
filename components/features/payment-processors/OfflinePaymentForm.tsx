'use client'

import PaymentProcessorFormBase from '../payment-gateway/PaymentProcessorFormBase'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export function OfflinePaymentForm({ settings, onChange }: Props) {
  return (
    <PaymentProcessorFormBase slug="offline" settings={settings} onChange={onChange}>
      <div>
        <label htmlFor="offline-instructions" className="block text-sm font-medium text-gray-700">
          Payment Instructions
        </label>
        <textarea
          id="offline-instructions"
          rows={4}
          value={settings.instructions ?? ''}
          onChange={(e) => onChange('instructions', e.target.value)}
          placeholder="Enter payment instructions for customers"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="offline-bank-name" className="block text-sm font-medium text-gray-700">
          Bank Name
        </label>
        <input
          id="offline-bank-name"
          type="text"
          value={settings.bank_name ?? ''}
          onChange={(e) => onChange('bank_name', e.target.value)}
          placeholder="Enter Bank Name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="offline-account-number" className="block text-sm font-medium text-gray-700">
          Account Number
        </label>
        <input
          id="offline-account-number"
          type="text"
          value={settings.account_number ?? ''}
          onChange={(e) => onChange('account_number', e.target.value)}
          placeholder="Enter Account Number"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="offline-account-name" className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <input
          id="offline-account-name"
          type="text"
          value={settings.account_name ?? ''}
          onChange={(e) => onChange('account_name', e.target.value)}
          placeholder="Enter Account Name"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}

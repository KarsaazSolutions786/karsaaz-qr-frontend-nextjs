'use client'

import { useState } from 'react'
import { QRCodeTypeSelector } from './QRCodeTypeSelector'
import { QRCodeCustomizer } from './QRCodeCustomizer'
import { URLDataForm } from './forms/URLDataForm'
import { VCardDataForm } from './forms/VCardDataForm'
import { WiFiDataForm } from './forms/WiFiDataForm'
import { TextDataForm } from './forms/TextDataForm'
import { EmailDataForm } from './forms/EmailDataForm'
import { SMSDataForm } from './forms/SMSDataForm'
import { PhoneDataForm } from './forms/PhoneDataForm'
import { LocationDataForm } from './forms/LocationDataForm'
import { CalendarDataForm } from './forms/CalendarDataForm'
import { AppStoreDataForm } from './forms/AppStoreDataForm'

interface QRCodeFormProps {
  initialType?: string
  initialName?: string
  initialData?: any
  initialCustomization?: any
  onSubmit: (data: { name: string; type: string; data: any; customization?: any }) => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function QRCodeForm({
  initialType = 'url',
  initialName = '',
  initialData,
  initialCustomization,
  onSubmit,
  submitLabel = 'Create QR Code',
  isSubmitting = false,
}: QRCodeFormProps) {
  const [name, setName] = useState(initialName)
  const [type, setType] = useState(initialType)
  const [data, setData] = useState(initialData)
  const [customization, setCustomization] = useState(initialCustomization || {})

  const handleSubmit = () => {
    if (!name || !data) return
    onSubmit({ name, type, data, customization })
  }

  const renderDataForm = () => {
    const formProps = {
      defaultValues: data,
      onSubmit: setData,
    }

    switch (type) {
      case 'url':
        return <URLDataForm {...formProps} />
      case 'vcard':
        return <VCardDataForm {...formProps} />
      case 'wifi':
        return <WiFiDataForm {...formProps} />
      case 'text':
        return <TextDataForm {...formProps} />
      case 'email':
        return <EmailDataForm {...formProps} />
      case 'sms':
        return <SMSDataForm {...formProps} />
      case 'phone':
        return <PhoneDataForm {...formProps} />
      case 'location':
        return <LocationDataForm {...formProps} />
      case 'calendar':
        return <CalendarDataForm {...formProps} />
      case 'app-store':
        return <AppStoreDataForm {...formProps} />
      default:
        return <div className="text-sm text-gray-500">Unknown QR code type</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          QR Code Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Website Link"
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Type Selector */}
      {!initialType && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <QRCodeTypeSelector value={type} onChange={(newType) => {
            setType(newType)
            setData(null) // Reset data when type changes
          }} />
        </div>
      )}

      {/* Data Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data</h2>
        {renderDataForm()}
      </div>

      {/* Customization */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <QRCodeCustomizer customization={customization} onChange={setCustomization} />
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name || !data || isSubmitting}
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : submitLabel}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

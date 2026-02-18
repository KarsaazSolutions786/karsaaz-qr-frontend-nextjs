'use client'

import { QRCodeTypeSelector } from '@/components/features/qrcodes/QRCodeTypeSelector'
import { URLDataForm } from '@/components/features/qrcodes/forms/URLDataForm'
import { VCardDataForm } from '@/components/features/qrcodes/forms/VCardDataForm'
import { WiFiDataForm } from '@/components/features/qrcodes/forms/WiFiDataForm'
import { TextDataForm } from '@/components/features/qrcodes/forms/TextDataForm'
import { EmailDataForm } from '@/components/features/qrcodes/forms/EmailDataForm'
import { SMSDataForm } from '@/components/features/qrcodes/forms/SMSDataForm'
import { PhoneDataForm } from '@/components/features/qrcodes/forms/PhoneDataForm'
import { LocationDataForm } from '@/components/features/qrcodes/forms/LocationDataForm'
import { CalendarDataForm } from '@/components/features/qrcodes/forms/CalendarDataForm'
import { AppStoreDataForm } from '@/components/features/qrcodes/forms/AppStoreDataForm'
import { QRCodePreview } from '@/components/features/qrcodes/QRCodePreview'
import { Info } from 'lucide-react'

interface Step2TypeAndDataProps {
  qrType: string
  onChange: (field: string, value: any) => void
  formData: any
  errors?: Record<string, string>
  showPreview?: boolean
}

export default function Step2TypeAndData({
  qrType,
  onChange,
  formData,
  errors = {},
  showPreview = true,
}: Step2TypeAndDataProps) {
  const handleTypeChange = (type: string) => {
    onChange('type', type)
    // Reset data when type changes
    onChange('data', {})
  }

  const handleDataChange = (data: any) => {
    onChange('data', data)
  }

  const renderDataForm = () => {
    const commonProps = {
      defaultValues: formData.data || {},
      onSubmit: handleDataChange,
    }

    switch (qrType) {
      case 'url':
        return <URLDataForm {...commonProps} />
      case 'vcard':
        return <VCardDataForm {...commonProps} />
      case 'wifi':
        return <WiFiDataForm {...commonProps} />
      case 'text':
        return <TextDataForm {...commonProps} />
      case 'email':
        return <EmailDataForm {...commonProps} />
      case 'sms':
        return <SMSDataForm {...commonProps} />
      case 'phone':
        return <PhoneDataForm {...commonProps} />
      case 'location':
        return <LocationDataForm {...commonProps} />
      case 'calendar':
        return <CalendarDataForm {...commonProps} />
      case 'app-store':
        return <AppStoreDataForm {...commonProps} />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Please select a QR code type
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Type Selector */}
      <div>
        <QRCodeTypeSelector value={qrType} onChange={handleTypeChange} />
        {errors.type && (
          <p className="mt-2 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Data Form and Preview */}
      {qrType && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enter QR Code Data
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {renderDataForm()}
            </div>
            {errors.data && (
              <p className="mt-2 text-sm text-red-600">{errors.data}</p>
            )}
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h3>
              <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
                <div className="flex flex-col items-center gap-4">
                  <QRCodePreview
                    qrcode={{
                      id: '',
                      userId: '',
                      name: '',
                      type: qrType as any,
                      data: formData.data ?? {},
                      customization: formData.customization ?? { foregroundColor: '#000000', backgroundColor: '#FFFFFF', style: 'squares', size: 256 },
                      createdAt: '',
                      updatedAt: '',
                      scans: 0,
                    }}
                    size={200}
                  />
                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-md p-3">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <p>
                      Preview updates as you fill in the form. You can customize the design in the next step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

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
import { WhatsAppDataForm } from './forms/WhatsAppDataForm'
import { TelegramDataForm } from './forms/TelegramDataForm'
import { InstagramDataForm } from './forms/InstagramDataForm'
import { FacebookDataForm } from './forms/FacebookDataForm'
import { YouTubeDataForm } from './forms/YouTubeDataForm'
import { LinkedInDataForm } from './forms/LinkedInDataForm'
import { SnapchatDataForm } from './forms/SnapchatDataForm'
import { SpotifyDataForm } from './forms/SpotifyDataForm'
import { TikTokDataForm } from './forms/TikTokDataForm'
import { TwitterXDataForm } from './forms/TwitterXDataForm'
import { FacebookMessengerDataForm } from './forms/FacebookMessengerDataForm'
import { ViberDataForm } from './forms/ViberDataForm'
import { FaceTimeDataForm } from './forms/FaceTimeDataForm'
import { WeChatDataForm } from './forms/WeChatDataForm'
import { SkypeDataForm } from './forms/SkypeDataForm'
import { ZoomDataForm } from './forms/ZoomDataForm'
import { PayPalDataForm } from './forms/PayPalDataForm'
import { CryptoDataForm } from './forms/CryptoDataForm'
import { BrazilPIXDataForm } from './forms/BrazilPIXDataForm'
import { GoogleMapsDataForm } from './forms/GoogleMapsDataForm'
import { DynamicEmailDataForm } from './forms/DynamicEmailDataForm'
import { DynamicSMSDataForm } from './forms/DynamicSMSDataForm'
import { GoogleReviewDataForm } from './forms/GoogleReviewDataForm'
import { FileUploadDataForm } from './forms/FileUploadDataForm'
import { UPIDynamicDataForm } from './forms/UPIDynamicDataForm'

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
      case 'whatsapp':
        return <WhatsAppDataForm {...formProps} />
      case 'telegram':
        return <TelegramDataForm {...formProps} />
      case 'instagram':
        return <InstagramDataForm {...formProps} />
      case 'facebook':
        return <FacebookDataForm {...formProps} />
      case 'youtube':
        return <YouTubeDataForm {...formProps} />
      case 'linkedin':
        return <LinkedInDataForm {...formProps} />
      case 'snapchat':
        return <SnapchatDataForm {...formProps} />
      case 'spotify':
        return <SpotifyDataForm {...formProps} />
      case 'tiktok':
        return <TikTokDataForm {...formProps} />
      case 'x':
        return <TwitterXDataForm {...formProps} />
      case 'facebookmessenger':
        return <FacebookMessengerDataForm {...formProps} />
      case 'viber':
        return <ViberDataForm {...formProps} />
      case 'facetime':
        return <FaceTimeDataForm {...formProps} />
      case 'wechat':
        return <WeChatDataForm {...formProps} />
      case 'skype':
        return <SkypeDataForm {...formProps} />
      case 'zoom':
        return <ZoomDataForm {...formProps} />
      case 'paypal':
        return <PayPalDataForm {...formProps} />
      case 'crypto':
        return <CryptoDataForm {...formProps} />
      case 'brazilpix':
        return <BrazilPIXDataForm {...formProps} />
      case 'googlemaps':
        return <GoogleMapsDataForm {...formProps} />
      case 'email-dynamic':
        return <DynamicEmailDataForm {...formProps} />
      case 'sms-dynamic':
        return <DynamicSMSDataForm {...formProps} />
      case 'google-review':
        return <GoogleReviewDataForm {...formProps} />
      case 'file-upload':
        return <FileUploadDataForm {...formProps} />
      case 'upi-dynamic':
        return <UPIDynamicDataForm {...formProps} />
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

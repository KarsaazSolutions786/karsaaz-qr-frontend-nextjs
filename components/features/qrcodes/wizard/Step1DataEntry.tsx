'use client'

import { useCallback, useEffect, useRef } from 'react'
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
import { WhatsAppDataForm } from '@/components/features/qrcodes/forms/WhatsAppDataForm'
import { TelegramDataForm } from '@/components/features/qrcodes/forms/TelegramDataForm'
import { InstagramDataForm } from '@/components/features/qrcodes/forms/InstagramDataForm'
import { FacebookDataForm } from '@/components/features/qrcodes/forms/FacebookDataForm'
import { YouTubeDataForm } from '@/components/features/qrcodes/forms/YouTubeDataForm'
import { LinkedInDataForm } from '@/components/features/qrcodes/forms/LinkedInDataForm'
import { SnapchatDataForm } from '@/components/features/qrcodes/forms/SnapchatDataForm'
import { SpotifyDataForm } from '@/components/features/qrcodes/forms/SpotifyDataForm'
import { TikTokDataForm } from '@/components/features/qrcodes/forms/TikTokDataForm'
import { TwitterXDataForm } from '@/components/features/qrcodes/forms/TwitterXDataForm'
import { FacebookMessengerDataForm } from '@/components/features/qrcodes/forms/FacebookMessengerDataForm'
import { ViberDataForm } from '@/components/features/qrcodes/forms/ViberDataForm'
import { FaceTimeDataForm } from '@/components/features/qrcodes/forms/FaceTimeDataForm'
import { WeChatDataForm } from '@/components/features/qrcodes/forms/WeChatDataForm'
import { SkypeDataForm } from '@/components/features/qrcodes/forms/SkypeDataForm'
import { ZoomDataForm } from '@/components/features/qrcodes/forms/ZoomDataForm'
import { PayPalDataForm } from '@/components/features/qrcodes/forms/PayPalDataForm'
import { CryptoDataForm } from '@/components/features/qrcodes/forms/CryptoDataForm'
import { BrazilPIXDataForm } from '@/components/features/qrcodes/forms/BrazilPIXDataForm'
import { GoogleMapsDataForm } from '@/components/features/qrcodes/forms/GoogleMapsDataForm'
import { DynamicEmailDataForm } from '@/components/features/qrcodes/forms/DynamicEmailDataForm'
import { DynamicSMSDataForm } from '@/components/features/qrcodes/forms/DynamicSMSDataForm'
import { GoogleReviewDataForm } from '@/components/features/qrcodes/forms/GoogleReviewDataForm'
import { FileUploadDataForm } from '@/components/features/qrcodes/forms/FileUploadDataForm'
import { UPIDynamicDataForm } from '@/components/features/qrcodes/forms/UPIDynamicDataForm'
import { QRCodePreview } from '@/components/qr/QRCodePreview'
import { encodeQRData } from '@/lib/utils/qr-data-encoder'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { Info } from 'lucide-react'

interface Step1DataEntryProps {
  qrType: string
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

export default function Step1DataEntry({
  qrType,
  data,
  onChange,
}: Step1DataEntryProps) {
  // Get the type info for display
  const typeInfo = QR_TYPES.find(t => t.id === qrType)

  // Encode data for live preview
  const previewData = encodeQRData(qrType, data)

  // Debounced data capture from form inputs
  const formRef = useRef<HTMLDivElement>(null)

  // Capture form data on every input change via event delegation
  const handleFormInteraction = useCallback(() => {
    if (!formRef.current) return
    const form = formRef.current.querySelector('form')
    if (!form) return

    const formData = new FormData(form)
    const captured: Record<string, any> = {}
    formData.forEach((value, key) => {
      captured[key] = value
    })

    // Also capture checkboxes (FormData doesn't include unchecked checkboxes)
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((cb) => {
      const checkbox = cb as HTMLInputElement
      if (checkbox.name) {
        captured[checkbox.name] = checkbox.checked
      }
    })

    if (Object.keys(captured).length > 0) {
      onChange(captured)
    }
  }, [onChange])

  // Set up event delegation for capturing form changes in real-time
  useEffect(() => {
    const container = formRef.current
    if (!container) return

    const handleInput = () => handleFormInteraction()
    const handleChange = () => handleFormInteraction()

    container.addEventListener('input', handleInput)
    container.addEventListener('change', handleChange)

    return () => {
      container.removeEventListener('input', handleInput)
      container.removeEventListener('change', handleChange)
    }
  }, [handleFormInteraction])

  const handleDataSubmit = useCallback((formData: any) => {
    onChange(formData)
  }, [onChange])

  const renderDataForm = () => {
    const commonProps = {
      defaultValues: data as any,
      onSubmit: handleDataSubmit,
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
      case 'whatsapp':
        return <WhatsAppDataForm {...commonProps} />
      case 'telegram':
        return <TelegramDataForm {...commonProps} />
      case 'instagram':
        return <InstagramDataForm {...commonProps} />
      case 'facebook':
        return <FacebookDataForm {...commonProps} />
      case 'youtube':
        return <YouTubeDataForm {...commonProps} />
      case 'linkedin':
        return <LinkedInDataForm {...commonProps} />
      case 'snapchat':
        return <SnapchatDataForm {...commonProps} />
      case 'spotify':
        return <SpotifyDataForm {...commonProps} />
      case 'tiktok':
        return <TikTokDataForm {...commonProps} />
      case 'x':
        return <TwitterXDataForm {...commonProps} />
      case 'facebookmessenger':
        return <FacebookMessengerDataForm {...commonProps} />
      case 'viber':
        return <ViberDataForm {...commonProps} />
      case 'facetime':
        return <FaceTimeDataForm {...commonProps} />
      case 'wechat':
        return <WeChatDataForm {...commonProps} />
      case 'skype':
        return <SkypeDataForm {...commonProps} />
      case 'zoom':
        return <ZoomDataForm {...commonProps} />
      case 'paypal':
        return <PayPalDataForm {...commonProps} />
      case 'crypto':
        return <CryptoDataForm {...commonProps} />
      case 'brazilpix':
        return <BrazilPIXDataForm {...commonProps} />
      case 'googlemaps':
        return <GoogleMapsDataForm {...commonProps} />
      case 'email-dynamic':
        return <DynamicEmailDataForm {...commonProps} />
      case 'sms-dynamic':
        return <DynamicSMSDataForm {...commonProps} />
      case 'google-review':
        return <GoogleReviewDataForm {...commonProps} />
      case 'file-upload':
        return <FileUploadDataForm {...commonProps} />
      case 'upi-dynamic':
        return <UPIDynamicDataForm {...commonProps} />
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Form for &quot;{qrType}&quot; type is not yet available.</p>
            <p className="text-sm mt-2">You can still proceed to design your QR code.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Type Header */}
      {typeInfo && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm border border-gray-100">
            {typeInfo.icon.endsWith('.svg') || typeInfo.icon.endsWith('.png') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeInfo.icon}
                alt={typeInfo.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-2xl flex items-center justify-center h-full">
                {typeInfo.icon}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{typeInfo.name}</h3>
            <p className="text-sm text-gray-500">{typeInfo.description}</p>
          </div>
        </div>
      )}

      {/* Data Form + Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Data Form (takes more space) */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Enter QR Code Data
          </h3>
          <div
            ref={formRef}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            {renderDataForm()}
          </div>
        </div>

        {/* Live Preview (sticky sidebar) */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h3>
          <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
            <div className="flex flex-col items-center gap-4">
              {previewData ? (
                <QRCodePreview
                  data={previewData}
                  className="w-full max-w-[256px] mx-auto"
                />
              ) : (
                <div className="w-[256px] h-[256px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-5xl mb-2">⬜</div>
                    <p className="text-sm">Fill in the form to<br />see your QR code</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-md p-3 w-full">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <p>
                  Preview updates as you fill in the form. You&apos;ll customize the design in the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

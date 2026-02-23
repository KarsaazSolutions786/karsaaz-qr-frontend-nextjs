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
import { RestaurantMenuDataForm } from '@/components/features/qrcodes/forms/RestaurantMenuDataForm'
import { ProductCatalogueDataForm } from '@/components/features/qrcodes/forms/ProductCatalogueDataForm'
import { ResumeDataForm } from '@/components/features/qrcodes/forms/ResumeDataForm'
import { WebsiteBuilderDataForm } from '@/components/features/qrcodes/forms/WebsiteBuilderDataForm'
import { BusinessReviewDataForm } from '@/components/features/qrcodes/forms/BusinessReviewDataForm'
import { LeadFormDataForm } from '@/components/features/qrcodes/forms/LeadFormDataForm'
import { EventDataForm } from '@/components/features/qrcodes/forms/EventDataForm'
import { VCardPlusDataForm } from '@/components/features/qrcodes/forms/VCardPlusDataForm'
import { UPIStaticDataForm } from '@/components/features/qrcodes/forms/UPIStaticDataForm'
import { BiolinksDataForm } from '@/components/features/qrcodes/forms/BiolinksDataForm'
import { BusinessProfileDataForm } from '@/components/features/qrcodes/forms/BusinessProfileDataForm'
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
      case 'restaurant-menu':
        return <RestaurantMenuDataForm {...commonProps} />
      case 'product-catalogue':
        return <ProductCatalogueDataForm {...commonProps} />
      case 'resume':
        return <ResumeDataForm {...commonProps} />
      case 'website-builder':
        return <WebsiteBuilderDataForm {...commonProps} />
      case 'business-review':
        return <BusinessReviewDataForm {...commonProps} />
      case 'lead-form':
        return <LeadFormDataForm {...commonProps} />
      case 'event':
        return <EventDataForm {...commonProps} />
      case 'vcard-plus':
        return <VCardPlusDataForm {...commonProps} />
      case 'upi':
        return <UPIStaticDataForm {...commonProps} />
      case 'biolinks':
        return <BiolinksDataForm {...commonProps} />
      case 'business-profile':
        return <BusinessProfileDataForm {...commonProps} />
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

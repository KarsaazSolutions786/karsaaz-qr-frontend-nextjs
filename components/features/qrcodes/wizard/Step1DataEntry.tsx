'use client'

import { useCallback, useMemo } from 'react'
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
import { QR_TYPES } from '@/lib/constants/qr-types'
import { Lightbulb, Zap, Shield, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

/** Contextual tips per QR type for the sidebar */
const TYPE_TIPS: Record<string, string[]> = {
  text: [
    'Enter any text, URL, or message you want to encode.',
    'Static QR — the content cannot be changed after printing.',
    'Keep text short for better scan reliability.',
  ],
  url: [
    'Always include https:// for a valid link.',
    'Dynamic QR — you can change the destination URL anytime.',
    'Great for marketing campaigns where you need tracking.',
  ],
  vcard: [
    'Fill in your contact details to create a shareable business card.',
    'Scanning adds you directly to the phone\'s contacts.',
    'Include a photo URL for a professional touch.',
  ],
  wifi: [
    'Your WiFi password is encoded in the QR — no need to share it verbally.',
    'Supports WPA/WPA2, WEP, and open networks.',
    'Perfect for cafés, offices, and Airbnbs.',
  ],
  email: [
    'Pre-fill recipient, subject, and body for one-tap emails.',
    'Great for feedback forms and support requests.',
  ],
  whatsapp: [
    'Include your phone number with country code (e.g. +1...).',
    'You can pre-fill a message users will send you.',
  ],
  'business-profile': [
    'Showcase your business details — name, hours, contact info.',
    'Dynamic QR — update your profile anytime without reprinting.',
    'Add location, phone, email and social links.',
  ],
}

const DEFAULT_TIPS = [
  'Fill in the required fields, then click Next to customize your design.',
  'You can come back and edit this data anytime.',
  'Dynamic QR types let you change content after printing.',
]

interface Step1DataEntryProps {
  qrType: string
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

export default function Step1DataEntry({ qrType, data, onChange }: Step1DataEntryProps) {
  const { t } = useTranslation()
  const typeInfo = QR_TYPES.find(tp => tp.id === qrType)
  const tips = useMemo(() => TYPE_TIPS[qrType] || DEFAULT_TIPS, [qrType])
  const isDynamic = typeInfo?.cat === 'dynamic'

  const handleDataChange = useCallback(
    (formData: any) => {
      onChange(formData)
    },
    [onChange]
  )

  const renderDataForm = () => {
    const commonProps = {
      defaultValues: data as any,
      onChange: handleDataChange,
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
      case 'app-download':
        return <AppStoreDataForm {...commonProps} />
      case 'call':
        return <PhoneDataForm {...commonProps} />
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
            <p>{t('Form for this type is not yet available.')}</p>
            <p className="text-sm mt-2">{t('You can still proceed to design your QR code.')}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Type Badge ── */}
      {typeInfo && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white p-4 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-purple-100">
              {typeInfo.icon.endsWith('.svg') || typeInfo.icon.endsWith('.png') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={typeInfo.icon}
                  alt={typeInfo.name}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-2xl">{typeInfo.icon}</span>
              )}
            </div>
            {/* Name + description */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{typeInfo.name}</h3>
                {isDynamic && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <Zap className="h-3 w-3" />
                    {t('Dynamic')}
                  </span>
                )}
                {!isDynamic && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200">
                    {t('Static')}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{typeInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content: Form + Tips sidebar ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form area — takes 2/3 on desktop */}
        <div className="lg:col-span-2">
          {renderDataForm()}
        </div>

        {/* Tips sidebar — takes 1/3 on desktop, stacks below on mobile */}
        <div className="space-y-4">
          {/* Tips card */}
          <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                <Lightbulb className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-purple-900">{t('Tips')}</h4>
            </div>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-gray-600">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-purple-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic badge explanation */}
          {isDynamic && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">{t('Dynamic QR')}</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {t('You can change the destination content anytime without reprinting. Includes scan analytics and tracking.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

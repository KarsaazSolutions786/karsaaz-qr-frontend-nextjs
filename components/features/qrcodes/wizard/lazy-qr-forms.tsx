'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { WizardFormSkeleton } from './WizardStepSkeleton'

type QRFormComponent = ComponentType<{
  defaultValues?: Record<string, unknown>
  onChange?: (data: Record<string, unknown>) => void
}>

function lazyForm(importFn: () => Promise<{ [key: string]: QRFormComponent }>, exportName: string) {
  return dynamic(() => importFn().then(mod => ({ default: mod[exportName] as QRFormComponent })), {
    loading: () => <WizardFormSkeleton />,
  })
}

export const LAZY_QR_FORMS: Record<string, QRFormComponent> = {
  url: lazyForm(() => import('@/components/features/qrcodes/forms/URLDataForm'), 'URLDataForm'),
  vcard: lazyForm(
    () => import('@/components/features/qrcodes/forms/VCardDataForm'),
    'VCardDataForm'
  ),
  wifi: lazyForm(() => import('@/components/features/qrcodes/forms/WiFiDataForm'), 'WiFiDataForm'),
  text: lazyForm(() => import('@/components/features/qrcodes/forms/TextDataForm'), 'TextDataForm'),
  email: lazyForm(
    () => import('@/components/features/qrcodes/forms/EmailDataForm'),
    'EmailDataForm'
  ),
  sms: lazyForm(() => import('@/components/features/qrcodes/forms/SMSDataForm'), 'SMSDataForm'),
  phone: lazyForm(
    () => import('@/components/features/qrcodes/forms/PhoneDataForm'),
    'PhoneDataForm'
  ),
  location: lazyForm(
    () => import('@/components/features/qrcodes/forms/LocationDataForm'),
    'LocationDataForm'
  ),
  calendar: lazyForm(
    () => import('@/components/features/qrcodes/forms/CalendarDataForm'),
    'CalendarDataForm'
  ),
  'app-store': lazyForm(
    () => import('@/components/features/qrcodes/forms/AppStoreDataForm'),
    'AppStoreDataForm'
  ),
  whatsapp: lazyForm(
    () => import('@/components/features/qrcodes/forms/WhatsAppDataForm'),
    'WhatsAppDataForm'
  ),
  telegram: lazyForm(
    () => import('@/components/features/qrcodes/forms/TelegramDataForm'),
    'TelegramDataForm'
  ),
  instagram: lazyForm(
    () => import('@/components/features/qrcodes/forms/InstagramDataForm'),
    'InstagramDataForm'
  ),
  facebook: lazyForm(
    () => import('@/components/features/qrcodes/forms/FacebookDataForm'),
    'FacebookDataForm'
  ),
  youtube: lazyForm(
    () => import('@/components/features/qrcodes/forms/YouTubeDataForm'),
    'YouTubeDataForm'
  ),
  linkedin: lazyForm(
    () => import('@/components/features/qrcodes/forms/LinkedInDataForm'),
    'LinkedInDataForm'
  ),
  snapchat: lazyForm(
    () => import('@/components/features/qrcodes/forms/SnapchatDataForm'),
    'SnapchatDataForm'
  ),
  spotify: lazyForm(
    () => import('@/components/features/qrcodes/forms/SpotifyDataForm'),
    'SpotifyDataForm'
  ),
  tiktok: lazyForm(
    () => import('@/components/features/qrcodes/forms/TikTokDataForm'),
    'TikTokDataForm'
  ),
  x: lazyForm(
    () => import('@/components/features/qrcodes/forms/TwitterXDataForm'),
    'TwitterXDataForm'
  ),
  facebookmessenger: lazyForm(
    () => import('@/components/features/qrcodes/forms/FacebookMessengerDataForm'),
    'FacebookMessengerDataForm'
  ),
  viber: lazyForm(
    () => import('@/components/features/qrcodes/forms/ViberDataForm'),
    'ViberDataForm'
  ),
  facetime: lazyForm(
    () => import('@/components/features/qrcodes/forms/FaceTimeDataForm'),
    'FaceTimeDataForm'
  ),
  wechat: lazyForm(
    () => import('@/components/features/qrcodes/forms/WeChatDataForm'),
    'WeChatDataForm'
  ),
  skype: lazyForm(
    () => import('@/components/features/qrcodes/forms/SkypeDataForm'),
    'SkypeDataForm'
  ),
  zoom: lazyForm(() => import('@/components/features/qrcodes/forms/ZoomDataForm'), 'ZoomDataForm'),
  paypal: lazyForm(
    () => import('@/components/features/qrcodes/forms/PayPalDataForm'),
    'PayPalDataForm'
  ),
  crypto: lazyForm(
    () => import('@/components/features/qrcodes/forms/CryptoDataForm'),
    'CryptoDataForm'
  ),
  brazilpix: lazyForm(
    () => import('@/components/features/qrcodes/forms/BrazilPIXDataForm'),
    'BrazilPIXDataForm'
  ),
  googlemaps: lazyForm(
    () => import('@/components/features/qrcodes/forms/GoogleMapsDataForm'),
    'GoogleMapsDataForm'
  ),
  'email-dynamic': lazyForm(
    () => import('@/components/features/qrcodes/forms/DynamicEmailDataForm'),
    'DynamicEmailDataForm'
  ),
  'sms-dynamic': lazyForm(
    () => import('@/components/features/qrcodes/forms/DynamicSMSDataForm'),
    'DynamicSMSDataForm'
  ),
  'google-review': lazyForm(
    () => import('@/components/features/qrcodes/forms/GoogleReviewDataForm'),
    'GoogleReviewDataForm'
  ),
  'file-upload': lazyForm(
    () => import('@/components/features/qrcodes/forms/FileUploadDataForm'),
    'FileUploadDataForm'
  ),
  'upi-dynamic': lazyForm(
    () => import('@/components/features/qrcodes/forms/UPIDynamicDataForm'),
    'UPIDynamicDataForm'
  ),
  'restaurant-menu': lazyForm(
    () => import('@/components/features/qrcodes/forms/RestaurantMenuDataForm'),
    'RestaurantMenuDataForm'
  ),
  'product-catalogue': lazyForm(
    () => import('@/components/features/qrcodes/forms/ProductCatalogueDataForm'),
    'ProductCatalogueDataForm'
  ),
  resume: lazyForm(
    () => import('@/components/features/qrcodes/forms/ResumeDataForm'),
    'ResumeDataForm'
  ),
  'website-builder': lazyForm(
    () => import('@/components/features/qrcodes/forms/WebsiteBuilderDataForm'),
    'WebsiteBuilderDataForm'
  ),
  'business-review': lazyForm(
    () => import('@/components/features/qrcodes/forms/BusinessReviewDataForm'),
    'BusinessReviewDataForm'
  ),
  'lead-form': lazyForm(
    () => import('@/components/features/qrcodes/forms/LeadFormDataForm'),
    'LeadFormDataForm'
  ),
  event: lazyForm(
    () => import('@/components/features/qrcodes/forms/EventDataForm'),
    'EventDataForm'
  ),
  'vcard-plus': lazyForm(
    () => import('@/components/features/qrcodes/forms/VCardPlusDataForm'),
    'VCardPlusDataForm'
  ),
  upi: lazyForm(
    () => import('@/components/features/qrcodes/forms/UPIStaticDataForm'),
    'UPIStaticDataForm'
  ),
  biolinks: lazyForm(
    () => import('@/components/features/qrcodes/forms/BiolinksDataForm'),
    'BiolinksDataForm'
  ),
  'business-profile': lazyForm(
    () => import('@/components/features/qrcodes/forms/BusinessProfileDataForm'),
    'BusinessProfileDataForm'
  ),
  call: lazyForm(
    () => import('@/components/features/qrcodes/forms/PhoneDataForm'),
    'PhoneDataForm'
  ),
  'app-download': lazyForm(
    () => import('@/components/features/qrcodes/forms/AppStoreDataForm'),
    'AppStoreDataForm'
  ),
}

export function getLazyQRForm(qrType: string): QRFormComponent | null {
  return LAZY_QR_FORMS[qrType] ?? null
}

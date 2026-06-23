import type { z } from 'zod'
import {
  urlDataSchema,
  textDataSchema,
  emailDataSchema,
  smsDataSchema,
  phoneDataSchema,
  wifiDataSchema,
  vcardDataSchema,
  whatsappDataSchema,
  locationDataSchema,
  eventDataSchema,
} from '@/lib/validations/qr-schemas'
import {
  calendarDataSchema,
  appStoreDataSchema,
  telegramDataSchema,
  instagramDataSchema,
  facebookDataSchema,
  youtubeDataSchema,
  linkedinDataSchema,
  snapchatDataSchema,
  spotifyDataSchema,
  tiktokDataSchema,
  twitterXDataSchema,
  facebookMessengerDataSchema,
  viberDataSchema,
  facetimeDataSchema,
  wechatDataSchema,
  skypeDataSchema,
  zoomDataSchema,
  paypalDataSchema,
  cryptoDataSchema,
  brazilPixDataSchema,
  googleMapsDataSchema,
  dynamicEmailDataSchema,
  dynamicSMSDataSchema,
  googleReviewDataSchema,
  fileUploadDataSchema,
  upiDynamicDataSchema,
  restaurantMenuDataSchema,
  productCatalogueDataSchema,
  resumeDataSchema,
  websiteBuilderDataSchema,
  businessReviewDataSchema,
  leadFormDataSchema,
  vcardPlusDataSchema,
  upiStaticDataSchema,
  biolinksDataSchema,
  businessProfileDataSchema,
} from '@/lib/validations/qrcode'
import type { WebpageDesignData } from '@/components/features/qrcodes/wizard/PageDesignPanel'

/** Per-type QR data payload shapes (matches backend `data` JSON) */
export interface QRFormDataMap {
  url: z.infer<typeof urlDataSchema>
  text: z.infer<typeof textDataSchema>
  email: z.infer<typeof emailDataSchema>
  sms: z.infer<typeof smsDataSchema>
  phone: z.infer<typeof phoneDataSchema>
  call: z.infer<typeof phoneDataSchema>
  wifi: z.infer<typeof wifiDataSchema>
  vcard: z.infer<typeof vcardDataSchema>
  whatsapp: z.infer<typeof whatsappDataSchema>
  location: z.infer<typeof locationDataSchema>
  event: z.infer<typeof eventDataSchema>
  calendar: z.infer<typeof calendarDataSchema>
  'app-store': z.infer<typeof appStoreDataSchema>
  'app-download': z.infer<typeof appStoreDataSchema>
  telegram: z.infer<typeof telegramDataSchema>
  instagram: z.infer<typeof instagramDataSchema>
  facebook: z.infer<typeof facebookDataSchema>
  youtube: z.infer<typeof youtubeDataSchema>
  linkedin: z.infer<typeof linkedinDataSchema>
  snapchat: z.infer<typeof snapchatDataSchema>
  spotify: z.infer<typeof spotifyDataSchema>
  tiktok: z.infer<typeof tiktokDataSchema>
  x: z.infer<typeof twitterXDataSchema>
  facebookmessenger: z.infer<typeof facebookMessengerDataSchema>
  viber: z.infer<typeof viberDataSchema>
  facetime: z.infer<typeof facetimeDataSchema>
  wechat: z.infer<typeof wechatDataSchema>
  skype: z.infer<typeof skypeDataSchema>
  zoom: z.infer<typeof zoomDataSchema>
  paypal: z.infer<typeof paypalDataSchema>
  crypto: z.infer<typeof cryptoDataSchema>
  brazilpix: z.infer<typeof brazilPixDataSchema>
  googlemaps: z.infer<typeof googleMapsDataSchema>
  'email-dynamic': z.infer<typeof dynamicEmailDataSchema>
  'sms-dynamic': z.infer<typeof dynamicSMSDataSchema>
  'google-review': z.infer<typeof googleReviewDataSchema>
  'file-upload': z.infer<typeof fileUploadDataSchema>
  'upi-dynamic': z.infer<typeof upiDynamicDataSchema>
  'restaurant-menu': z.infer<typeof restaurantMenuDataSchema>
  'product-catalogue': z.infer<typeof productCatalogueDataSchema>
  resume: z.infer<typeof resumeDataSchema>
  'website-builder': z.infer<typeof websiteBuilderDataSchema>
  'business-review': z.infer<typeof businessReviewDataSchema>
  'lead-form': z.infer<typeof leadFormDataSchema>
  'vcard-plus': z.infer<typeof vcardPlusDataSchema>
  upi: z.infer<typeof upiStaticDataSchema>
  biolinks: z.infer<typeof biolinksDataSchema>
  'business-profile': z.infer<typeof businessProfileDataSchema>
}

export type QRTypeSlug = keyof QRFormDataMap

export type QRFormDataForType<T extends string> = T extends QRTypeSlug
  ? QRFormDataMap[T]
  : Record<string, unknown>

export type QRTypeFormData = QRFormDataMap[QRTypeSlug]

/** Partial form state while the user is editing (any QR type) */
export type QRWizardFormDataState = Partial<QRTypeFormData> & Record<string, unknown>

export interface QRWizardSettings {
  name: string
  folderId: string | null
  pinProtected: boolean
  pin: string | null
  hasExpiration: boolean
  expiresAt: string | null
  tags: string[]
}

export interface QRCodeEditPayload {
  type?: string
  data?: QRWizardFormDataState
  designerConfig?: Record<string, unknown>
  customization?: Record<string, unknown>
  name?: string
  folderId?: string | null
  password?: string | null
  expiresAt?: string | null
  tags?: string[]
  webpageDesign?: WebpageDesignData
}

export interface QRCodeSaveResult {
  id: string
}

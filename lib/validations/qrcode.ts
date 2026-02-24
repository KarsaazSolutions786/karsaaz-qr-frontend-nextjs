import { z } from 'zod'

// Base QR code schema
export const qrCodeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  domainId: z.string().uuid().optional(),
})

// Customization schema
export const qrCustomizationSchema = z.object({
  foregroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .default('#000000'),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .default('#FFFFFF'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  style: z.enum(['squares', 'dots', 'rounded']).default('squares'),
  size: z.number().min(100).max(2000).default(500),
})

// URL QR code
export const urlDataSchema = z.object({
  url: z.string().url('Invalid URL'),
  expires_at: z.string().optional(),
})

export const createURLQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('url'),
  data: urlDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// VCard QR code
export const vcardDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phones: z.string().optional(),
  emails: z.string().email('Invalid email').optional().or(z.literal('')),
  website_list: z.string().url('Invalid URL').optional().or(z.literal('')),
  company: z.string().optional(),
  job: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

export const createVCardQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('vcard'),
  data: vcardDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// WiFi QR code
export const wifiDataSchema = z.object({
  ssid: z.string().min(1, 'Network name is required'),
  password: z.string().optional().default(''),
  encryption: z.enum(['WPA', 'WEP', 'nopass']).default('WPA'),
  hidden: z.boolean().default(false),
})

export const createWiFiQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('wifi'),
  data: wifiDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Text QR code
export const textDataSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text must be less than 500 characters'),
})

export const createTextQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('text'),
  data: textDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Email QR code
export const emailDataSchema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  body: z.string().optional(),
})

export const createEmailQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('email'),
  data: emailDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// SMS QR code
export const smsDataSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  message: z.string().optional(),
})

export const createSMSQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('sms'),
  data: smsDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Phone QR code
export const phoneDataSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
})

export const createPhoneQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('phone'),
  data: phoneDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Location QR code
export const locationDataSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  application: z.enum(['default', 'googlemaps', 'waze']).default('default'),
})

export const createLocationQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('location'),
  data: locationDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Calendar QR code
export const calendarDataSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  organizer_name: z.string().optional(),
  organizer_email: z.string().email('Invalid email').optional().or(z.literal('')),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  starts_at: z.string().min(1, 'Start time is required'),
  ends_at: z.string().min(1, 'End time is required'),
  timezone: z.string().optional(),
  description: z.string().optional(),
  frequency: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).default('none'),
})

export const createCalendarQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('calendar'),
  data: calendarDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// App Store QR code
export const appStoreDataSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  app_description: z.string().optional(),
  iosUrl: z.string().url('Invalid iOS URL').optional().or(z.literal('')),
  androidUrl: z.string().url('Invalid Android URL').optional().or(z.literal('')),
  expires_at: z.string().optional(),
  socialProfiles: z.string().optional(),
})

export const createAppStoreQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('app-store'),
  data: appStoreDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// WhatsApp QR code
export const whatsappDataSchema = z.object({
  mobile_number: z.string().optional(),
  message: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createWhatsAppQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('whatsapp'),
  data: whatsappDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Telegram QR code
export const telegramDataSchema = z.object({
  username: z.string().optional(),
})

export const createTelegramQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('telegram'),
  data: telegramDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Instagram QR code
export const instagramDataSchema = z.object({
  instagram: z.string().optional(),
})

export const createInstagramQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('instagram'),
  data: instagramDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Facebook QR code
export const facebookDataSchema = z.object({
  facebook: z.string().optional(),
})

export const createFacebookQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('facebook'),
  data: facebookDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// YouTube QR code
export const youtubeDataSchema = z.object({
  youtube: z.string().optional(),
})

export const createYouTubeQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('youtube'),
  data: youtubeDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// LinkedIn QR code
export const linkedinDataSchema = z.object({
  linkedin: z.string().optional(),
})

export const createLinkedInQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('linkedin'),
  data: linkedinDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Snapchat QR code
export const snapchatDataSchema = z.object({
  snapchat: z.string().optional(),
})

export const createSnapchatQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('snapchat'),
  data: snapchatDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Spotify QR code
export const spotifyDataSchema = z.object({
  spotify: z.string().optional(),
})

export const createSpotifyQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('spotify'),
  data: spotifyDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// TikTok QR code
export const tiktokDataSchema = z.object({
  tiktok: z.string().optional(),
})

export const createTikTokQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('tiktok'),
  data: tiktokDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Twitter/X QR code
export const twitterXDataSchema = z.object({
  x: z.string().optional(),
})

export const createTwitterXQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('x'),
  data: twitterXDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Facebook Messenger QR code
export const facebookMessengerDataSchema = z.object({
  facebook_page_name: z.string().optional(),
})

export const createFacebookMessengerQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('facebookmessenger'),
  data: facebookMessengerDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Viber QR code
export const viberDataSchema = z.object({
  viber_number: z.string().optional(),
})

export const createViberQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('viber'),
  data: viberDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// FaceTime QR code
export const facetimeDataSchema = z.object({
  target: z.string().optional(),
})

export const createFaceTimeQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('facetime'),
  data: facetimeDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// WeChat QR code
export const wechatDataSchema = z.object({
  username: z.string().optional(),
})

export const createWeChatQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('wechat'),
  data: wechatDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Skype QR code
export const skypeDataSchema = z.object({
  type: z.enum(['call', 'chat']).optional(),
  skype_name: z.string().optional(),
})

export const createSkypeQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('skype'),
  data: skypeDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Zoom QR code
export const zoomDataSchema = z.object({
  meeting_id: z.string().optional(),
  meeting_password: z.string().optional(),
})

export const createZoomQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('zoom'),
  data: zoomDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// PayPal QR code
export const paypalDataSchema = z.object({
  type: z.enum(['_xclick', '_donations', '_cart']).optional(),
  email: z.string().optional(),
  item_name: z.string().optional(),
  item_id: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  shipping: z.number().optional(),
  tax: z.number().optional(),
  expires_at: z.string().optional(),
})

export const createPayPalQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('paypal'),
  data: paypalDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Crypto QR code
export const cryptoDataSchema = z.object({
  coin: z.enum(['bitcoin', 'ethereum', 'litecoin', 'bitcoincash', 'dash']).optional(),
  address: z.string().optional(),
  amount: z.number().optional(),
  message: z.string().optional(),
})

export const createCryptoQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('crypto'),
  data: cryptoDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// BrazilPIX QR code
export const brazilPixDataSchema = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  city: z.string().optional(),
  amount: z.number().optional(),
  transaction_id: z.string().optional(),
  message: z.string().optional(),
})

export const createBrazilPIXQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('brazilpix'),
  data: brazilPixDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Google Maps QR code
export const googleMapsDataSchema = z.object({
  googlemaps: z.string().optional(),
})

export const createGoogleMapsQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('googlemaps'),
  data: googleMapsDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Dynamic Email QR code
export const dynamicEmailDataSchema = z.object({
  email: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createDynamicEmailQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('email-dynamic'),
  data: dynamicEmailDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Dynamic SMS QR code
export const dynamicSMSDataSchema = z.object({
  phone: z.string().optional(),
  message: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createDynamicSMSQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('sms-dynamic'),
  data: dynamicSMSDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Google Review QR code
export const googleReviewDataSchema = z.object({
  place: z.string().optional(),
  url_type: z.enum(['my-business', 'review-list', 'review-request']).optional(),
  expires_at: z.string().optional(),
})

export const createGoogleReviewQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('google-review'),
  data: googleReviewDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// File Upload QR code
export const fileUploadDataSchema = z.object({
  name: z.string().optional(),
  file_id: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createFileUploadQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('file-upload'),
  data: fileUploadDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// UPI Dynamic QR code
export const upiDynamicDataSchema = z.object({
  payee_name: z.string().optional(),
  upi_id: z.string().optional(),
  amount: z.number().min(1).optional(),
  expires_at: z.string().optional(),
})

export const createUPIDynamicQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('upi-dynamic'),
  data: upiDynamicDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Restaurant Menu QR code
export const restaurantMenuDataSchema = z.object({
  restaurant_name: z.string().min(1, 'Restaurant name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  review_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  maps_url: z.string().optional(),
  socialProfiles: z.string().optional(),
  opening_hours_enabled: z.enum(['enabled', 'disabled']).default('disabled'),
  expires_at: z.string().optional(),
})

export const createRestaurantMenuQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('restaurant-menu'),
  data: restaurantMenuDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Product Catalogue QR code
export const productCatalogueDataSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  maps_url: z.string().optional(),
  socialProfiles: z.string().optional(),
  opening_hours_enabled: z.enum(['enabled', 'disabled']).default('disabled'),
  expires_at: z.string().optional(),
})

export const createProductCatalogueQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('product-catalogue'),
  data: productCatalogueDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Resume QR code
export const resumeDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  resume_file_id: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createResumeQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('resume'),
  data: resumeDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Website Builder QR code
export const websiteBuilderDataSchema = z.object({
  website_name: z.string().min(1, 'Website name is required'),
  expires_at: z.string().optional(),
})

export const createWebsiteBuilderQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('website-builder'),
  data: websiteBuilderDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Business Review QR code
export const businessReviewDataSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  totalNumberOfStars: z.number().min(1).default(5),
  numberOfStarsToRedirect: z.number().min(1).default(3),
  action: z.enum(['google_review', 'review_url']).default('google_review'),
  show_final_review_link: z.enum(['enabled', 'disabled']).default('enabled'),
  google_place: z.string().optional(),
  review_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  expires_at: z.string().optional(),
})

export const createBusinessReviewQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('business-review'),
  data: businessReviewDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Lead Form QR code
export const leadFormDataSchema = z.object({
  form_name: z.string().min(1, 'Form name is required'),
  expires_at: z.string().optional(),
})

export const createLeadFormQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('lead-form'),
  data: leadFormDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Event QR code
export const eventDataSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  organizer_name: z.string().optional(),
  description: z.string().optional(),
  registration_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact_name: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  location: z.string().optional(),
  location_url: z.string().optional(),
  timezone: z.string().optional(),
  socialProfiles: z.string().optional(),
  expires_at: z.string().optional(),
})

export const createEventQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('event'),
  data: eventDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// VCard Plus QR code
export const vcardPlusDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  phones: z.string().optional(),
  emails: z.string().optional(),
  whatsapp_number: z.string().optional(),
  company: z.string().optional(),
  job: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  street: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  maps_url: z.string().optional(),
  socialProfiles: z.string().optional(),
  openingHoursEnabled: z.enum(['enabled', 'disabled']).default('disabled'),
  expires_at: z.string().optional(),
})

export const createVCardPlusQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('vcard-plus'),
  data: vcardPlusDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// UPI Static QR code
export const upiStaticDataSchema = z.object({
  payee_name: z.string().min(1, 'Payee name is required'),
  upi_id: z.string().min(1, 'UPI ID is required'),
  amount: z.number().min(1).optional(),
})

export const createUPIStaticQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('upi'),
  data: upiStaticDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Biolinks QR code (simple schema for QR wizard data step)
export const biolinksDataSchema = z.object({
  page_name: z.string().min(1, 'Page name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  expires_at: z.string().optional(),
})

export const createBiolinksQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('biolinks'),
  data: biolinksDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Business Profile QR code (simple schema for QR wizard data step)
export const businessProfileDataSchema = z.object({
  business_type: z.string().default('other'),
  business_name: z.string().min(1, 'Business name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  description: z.string().optional(),
  maps_url: z.string().optional(),
  socialProfiles: z.string().optional(),
  opening_hours_enabled: z.enum(['enabled', 'disabled']).default('disabled'),
  expires_at: z.string().optional(),
})

export const createBusinessProfileQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('business-profile'),
  data: businessProfileDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Union type for all QR code creation schemas
export const createQRCodeSchema = z.discriminatedUnion('type', [
  createURLQRCodeSchema,
  createVCardQRCodeSchema,
  createWiFiQRCodeSchema,
  createTextQRCodeSchema,
  createEmailQRCodeSchema,
  createSMSQRCodeSchema,
  createPhoneQRCodeSchema,
  createLocationQRCodeSchema,
  createCalendarQRCodeSchema,
  createAppStoreQRCodeSchema,
  createWhatsAppQRCodeSchema,
  createTelegramQRCodeSchema,
  createInstagramQRCodeSchema,
  createFacebookQRCodeSchema,
  createYouTubeQRCodeSchema,
  createLinkedInQRCodeSchema,
  createSnapchatQRCodeSchema,
  createSpotifyQRCodeSchema,
  createTikTokQRCodeSchema,
  createTwitterXQRCodeSchema,
  createFacebookMessengerQRCodeSchema,
  createViberQRCodeSchema,
  createFaceTimeQRCodeSchema,
  createWeChatQRCodeSchema,
  createSkypeQRCodeSchema,
  createZoomQRCodeSchema,
  createPayPalQRCodeSchema,
  createCryptoQRCodeSchema,
  createBrazilPIXQRCodeSchema,
  createGoogleMapsQRCodeSchema,
  createDynamicEmailQRCodeSchema,
  createDynamicSMSQRCodeSchema,
  createGoogleReviewQRCodeSchema,
  createFileUploadQRCodeSchema,
  createUPIDynamicQRCodeSchema,
  createRestaurantMenuQRCodeSchema,
  createProductCatalogueQRCodeSchema,
  createResumeQRCodeSchema,
  createWebsiteBuilderQRCodeSchema,
  createBusinessReviewQRCodeSchema,
  createLeadFormQRCodeSchema,
  createEventQRCodeSchema,
  createVCardPlusQRCodeSchema,
  createUPIStaticQRCodeSchema,
  createBiolinksQRCodeSchema,
  createBusinessProfileQRCodeSchema,
])

export type CreateQRCodeFormData = z.infer<typeof createQRCodeSchema>

// Update QR code schema - partial versions for each type
const updateURLQRCodeSchema = createURLQRCodeSchema.partial().required({ type: true })
const updateVCardQRCodeSchema = createVCardQRCodeSchema.partial().required({ type: true })
const updateWiFiQRCodeSchema = createWiFiQRCodeSchema.partial().required({ type: true })
const updateTextQRCodeSchema = createTextQRCodeSchema.partial().required({ type: true })
const updateEmailQRCodeSchema = createEmailQRCodeSchema.partial().required({ type: true })
const updateSMSQRCodeSchema = createSMSQRCodeSchema.partial().required({ type: true })
const updatePhoneQRCodeSchema = createPhoneQRCodeSchema.partial().required({ type: true })
const updateLocationQRCodeSchema = createLocationQRCodeSchema.partial().required({ type: true })
const updateCalendarQRCodeSchema = createCalendarQRCodeSchema.partial().required({ type: true })
const updateAppStoreQRCodeSchema = createAppStoreQRCodeSchema.partial().required({ type: true })
const updateWhatsAppQRCodeSchema = createWhatsAppQRCodeSchema.partial().required({ type: true })
const updateTelegramQRCodeSchema = createTelegramQRCodeSchema.partial().required({ type: true })
const updateInstagramQRCodeSchema = createInstagramQRCodeSchema.partial().required({ type: true })
const updateFacebookQRCodeSchema = createFacebookQRCodeSchema.partial().required({ type: true })
const updateYouTubeQRCodeSchema = createYouTubeQRCodeSchema.partial().required({ type: true })
const updateLinkedInQRCodeSchema = createLinkedInQRCodeSchema.partial().required({ type: true })
const updateSnapchatQRCodeSchema = createSnapchatQRCodeSchema.partial().required({ type: true })
const updateSpotifyQRCodeSchema = createSpotifyQRCodeSchema.partial().required({ type: true })
const updateTikTokQRCodeSchema = createTikTokQRCodeSchema.partial().required({ type: true })
const updateTwitterXQRCodeSchema = createTwitterXQRCodeSchema.partial().required({ type: true })
const updateFacebookMessengerQRCodeSchema = createFacebookMessengerQRCodeSchema
  .partial()
  .required({ type: true })
const updateViberQRCodeSchema = createViberQRCodeSchema.partial().required({ type: true })
const updateFaceTimeQRCodeSchema = createFaceTimeQRCodeSchema.partial().required({ type: true })
const updateWeChatQRCodeSchema = createWeChatQRCodeSchema.partial().required({ type: true })
const updateSkypeQRCodeSchema = createSkypeQRCodeSchema.partial().required({ type: true })
const updateZoomQRCodeSchema = createZoomQRCodeSchema.partial().required({ type: true })
const updatePayPalQRCodeSchema = createPayPalQRCodeSchema.partial().required({ type: true })
const updateCryptoQRCodeSchema = createCryptoQRCodeSchema.partial().required({ type: true })
const updateBrazilPIXQRCodeSchema = createBrazilPIXQRCodeSchema.partial().required({ type: true })
const updateGoogleMapsQRCodeSchema = createGoogleMapsQRCodeSchema.partial().required({ type: true })
const updateDynamicEmailQRCodeSchema = createDynamicEmailQRCodeSchema
  .partial()
  .required({ type: true })
const updateDynamicSMSQRCodeSchema = createDynamicSMSQRCodeSchema.partial().required({ type: true })
const updateGoogleReviewQRCodeSchema = createGoogleReviewQRCodeSchema
  .partial()
  .required({ type: true })
const updateFileUploadQRCodeSchema = createFileUploadQRCodeSchema.partial().required({ type: true })
const updateUPIDynamicQRCodeSchema = createUPIDynamicQRCodeSchema.partial().required({ type: true })

export const updateQRCodeSchema = z.discriminatedUnion('type', [
  updateURLQRCodeSchema,
  updateVCardQRCodeSchema,
  updateWiFiQRCodeSchema,
  updateTextQRCodeSchema,
  updateEmailQRCodeSchema,
  updateSMSQRCodeSchema,
  updatePhoneQRCodeSchema,
  updateLocationQRCodeSchema,
  updateCalendarQRCodeSchema,
  updateAppStoreQRCodeSchema,
  updateWhatsAppQRCodeSchema,
  updateTelegramQRCodeSchema,
  updateInstagramQRCodeSchema,
  updateFacebookQRCodeSchema,
  updateYouTubeQRCodeSchema,
  updateLinkedInQRCodeSchema,
  updateSnapchatQRCodeSchema,
  updateSpotifyQRCodeSchema,
  updateTikTokQRCodeSchema,
  updateTwitterXQRCodeSchema,
  updateFacebookMessengerQRCodeSchema,
  updateViberQRCodeSchema,
  updateFaceTimeQRCodeSchema,
  updateWeChatQRCodeSchema,
  updateSkypeQRCodeSchema,
  updateZoomQRCodeSchema,
  updatePayPalQRCodeSchema,
  updateCryptoQRCodeSchema,
  updateBrazilPIXQRCodeSchema,
  updateGoogleMapsQRCodeSchema,
  updateDynamicEmailQRCodeSchema,
  updateDynamicSMSQRCodeSchema,
  updateGoogleReviewQRCodeSchema,
  updateFileUploadQRCodeSchema,
  updateUPIDynamicQRCodeSchema,
])

export type UpdateQRCodeFormData = z.infer<typeof updateQRCodeSchema>

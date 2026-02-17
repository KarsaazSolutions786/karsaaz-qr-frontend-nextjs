import { z } from 'zod'

// Base QR code schema
export const qrCodeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  domainId: z.string().uuid().optional(),
})

// Customization schema
export const qrCustomizationSchema = z.object({
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#000000'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#FFFFFF'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  style: z.enum(['squares', 'dots', 'rounded']).default('squares'),
  size: z.number().min(100).max(2000).default(500),
})

// URL QR code
export const urlDataSchema = z.object({
  url: z.string().url('Invalid URL'),
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
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
})

export const createVCardQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('vcard'),
  data: vcardDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// WiFi QR code
export const wifiDataSchema = z.object({
  ssid: z.string().min(1, 'Network name is required'),
  password: z.string().min(8, 'WiFi password must be at least 8 characters'),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean(),
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
})

export const createLocationQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('location'),
  data: locationDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// Calendar QR code
export const calendarDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
})

export const createCalendarQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('calendar'),
  data: calendarDataSchema,
  customization: qrCustomizationSchema.optional(),
})

// App Store QR code
export const appStoreDataSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  iosUrl: z.string().url('Invalid iOS URL').optional(),
  androidUrl: z.string().url('Invalid Android URL').optional(),
})

export const createAppStoreQRCodeSchema = qrCodeBaseSchema.extend({
  type: z.literal('app-store'),
  data: appStoreDataSchema,
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
])

export type UpdateQRCodeFormData = z.infer<typeof updateQRCodeSchema>

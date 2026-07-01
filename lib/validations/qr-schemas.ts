/**
 * Wizard data-entry Zod schemas — single source of truth for QR form validation.
 */

import { z } from 'zod'
import { isPublicHttpUrl } from '@/lib/utils/safe-url'

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i
const WHATSAPP_PHONE_RE = /^\+\d{8,15}$/

function normalizePhone(value: string): string {
  return value.replace(/[\s\-()]/g, '')
}

const flexibleUrl = z
  .string()
  .min(1, 'Please enter a URL.')
  .refine(v => URL_RE.test(v.trim()), 'Please enter a valid URL (e.g. https://example.com).')
  .refine(v => isPublicHttpUrl(v.trim()), 'This URL is not allowed.')

export const urlDataSchema = z.object({
  url: flexibleUrl,
  expires_at: z.string().optional(),
})

export const textDataSchema = z.object({
  text: z
    .string()
    .min(1, 'Please enter the text to encode.')
    .max(500, 'Text must be less than 500 characters'),
})

export const emailDataSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter an email address.')
    .email('Please enter a valid email address.'),
  subject: z.string().optional(),
  message: z.string().optional(),
})

export const smsDataSchema = z.object({
  phone: z.string().min(1, 'Please enter a phone number.'),
  message: z.string().optional(),
})

export const phoneDataSchema = z.object({
  phone: z.string().min(1, 'Please enter a phone number.'),
})

export const wifiDataSchema = z.object({
  ssid: z.string().min(1, 'Please enter the network name (SSID).'),
  password: z.string().optional().default(''),
  type: z.enum(['nopass', 'WPA', 'WEP']).default('nopass'),
  hidden: z.boolean().default(false),
})

export const vcardDataSchema = z
  .object({
    firstName: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    phones: z.string().optional(),
    emails: z.string().email('Invalid email').optional().or(z.literal('')),
    website_list: z.string().optional(),
    company: z.string().optional(),
    job: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  })
  .refine(d => Boolean(d.firstName?.trim() || d.lastName?.trim()), {
    message: 'Please enter at least a first or last name.',
    path: ['firstName'],
  })

export const whatsappDataSchema = z.object({
  mobile_number: z
    .string()
    .min(1, 'Please enter a phone number with country code.')
    .refine(
      v => normalizePhone(v).startsWith('+'),
      'Please include the country code (e.g. +1, +44).'
    )
    .refine(
      v => WHATSAPP_PHONE_RE.test(normalizePhone(v)),
      'Please enter a valid phone number with country code.'
    ),
  message: z.string().optional(),
  expires_at: z.string().optional(),
})

export const locationDataSchema = z.object({
  latitude: z.number({ required_error: 'Please enter a latitude.' }).min(-90).max(90),
  longitude: z.number({ required_error: 'Please enter a longitude.' }).min(-180).max(180),
  address: z.string().optional(),
  application: z.enum(['default', 'google_maps', 'waze']).default('default'),
})

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

export const qrWizardSchemas = {
  url: urlDataSchema,
  text: textDataSchema,
  email: emailDataSchema,
  sms: smsDataSchema,
  phone: phoneDataSchema,
  call: phoneDataSchema,
  wifi: wifiDataSchema,
  vcard: vcardDataSchema,
  whatsapp: whatsappDataSchema,
  location: locationDataSchema,
  event: eventDataSchema,
  'email-dynamic': emailDataSchema,
  'sms-dynamic': smsDataSchema,
} as const satisfies Record<string, z.ZodTypeAny>

export type QRWizardSchemaType = keyof typeof qrWizardSchemas

export type QRTypeFormData =
  | z.infer<typeof urlDataSchema>
  | z.infer<typeof textDataSchema>
  | z.infer<typeof emailDataSchema>
  | z.infer<typeof smsDataSchema>
  | z.infer<typeof phoneDataSchema>
  | z.infer<typeof wifiDataSchema>
  | z.infer<typeof vcardDataSchema>
  | z.infer<typeof whatsappDataSchema>
  | z.infer<typeof locationDataSchema>
  | z.infer<typeof eventDataSchema>

export function validateWizardQRData(qrType: string, data: Record<string, unknown>): string | null {
  const schema = qrWizardSchemas[qrType as QRWizardSchemaType]
  if (!schema) return null

  const result = schema.safeParse(data ?? {})
  if (result.success) return null

  return result.error.errors[0]?.message ?? 'Please fill in the required fields before continuing.'
}


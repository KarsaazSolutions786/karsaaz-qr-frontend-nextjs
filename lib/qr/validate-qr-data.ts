/**
 * Client-side validation for QR code data, run BEFORE any create/update API call.
 *
 * Why this exists: the wizard previously sent the create request and only
 * checked "is some field non-empty" afterwards, so empty/invalid input produced
 * a server-side HTTP 422 (and could still consume quota). This validates the
 * required fields and basic formats per type up front so the user gets an
 * immediate, friendly message and no wasted API call.
 *
 * Returns an English message string (used directly as the i18n key via t()).
 */

export interface QRValidationResult {
  valid: boolean
  /** English message — pass through t() at the call site for translation. */
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts bare domains and full http(s) URLs (e.g. "example.com", "https://example.com/x").
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i

function isNonEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}

type FieldValidator = (data: Record<string, any>) => string | null

const VALIDATORS: Record<string, FieldValidator> = {
  url: d =>
    !isNonEmpty(d.url)
      ? 'Please enter a URL.'
      : !URL_RE.test(String(d.url).trim())
        ? 'Please enter a valid URL (e.g. https://example.com).'
        : null,
  text: d => (!isNonEmpty(d.text) ? 'Please enter the text to encode.' : null),
  email: d =>
    !isNonEmpty(d.email)
      ? 'Please enter an email address.'
      : !EMAIL_RE.test(String(d.email).trim())
        ? 'Please enter a valid email address.'
        : null,
  'email-dynamic': d =>
    !isNonEmpty(d.email)
      ? 'Please enter an email address.'
      : !EMAIL_RE.test(String(d.email).trim())
        ? 'Please enter a valid email address.'
        : null,
  phone: d => (!isNonEmpty(d.phone) ? 'Please enter a phone number.' : null),
  call: d => (!isNonEmpty(d.phone) ? 'Please enter a phone number.' : null),
  sms: d => (!isNonEmpty(d.phone) ? 'Please enter a phone number.' : null),
  'sms-dynamic': d => (!isNonEmpty(d.phone) ? 'Please enter a phone number.' : null),
  wifi: d => (!isNonEmpty(d.ssid) ? 'Please enter the network name (SSID).' : null),
  whatsapp: d => {
    if (!isNonEmpty(d.mobile_number)) return 'Please enter a phone number with country code.'
    const v = String(d.mobile_number).replace(/[\s\-()]/g, '')
    if (!v.startsWith('+')) return 'Please include the country code (e.g. +1, +44).'
    if (!/^\+\d{8,15}$/.test(v)) return 'Please enter a valid phone number with country code.'
    return null
  },
  vcard: d =>
    isNonEmpty(d.firstName) || isNonEmpty(d.lastName)
      ? null
      : 'Please enter at least a first or last name.',
}

/**
 * Validate the data-entry step for a QR type. Types without a specific
 * validator fall back to "at least one field must be filled in".
 */
export function validateQRData(qrType: string, data: Record<string, any>): QRValidationResult {
  const validator = VALIDATORS[qrType]
  if (validator) {
    const error = validator(data || {})
    return error ? { valid: false, error } : { valid: true }
  }

  const hasData = !!data && Object.values(data).some(isNonEmpty)
  return hasData
    ? { valid: true }
    : { valid: false, error: 'Please fill in the required fields before continuing.' }
}

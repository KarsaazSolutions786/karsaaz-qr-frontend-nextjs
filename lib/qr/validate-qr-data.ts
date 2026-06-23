/**
 * Client-side validation for QR code data, run BEFORE any create/update API call.
 */

import { validateWizardQRData, qrWizardSchemas } from '@/lib/validations/qr-schemas'

export interface QRValidationResult {
  valid: boolean
  /** English message — pass through t() at the call site for translation. */
  error?: string
}

function isNonEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}

/**
 * Validate the data-entry step for a QR type. Types with a Zod schema in
 * `qr-schemas.ts` use that as the single source of truth; others fall back to
 * "at least one field must be filled in".
 */
export function validateQRData(qrType: string, data: Record<string, unknown>): QRValidationResult {
  if (qrType in qrWizardSchemas) {
    const zodError = validateWizardQRData(qrType, data)
    return zodError ? { valid: false, error: zodError } : { valid: true }
  }

  const hasData = !!data && Object.values(data).some(isNonEmpty)
  return hasData
    ? { valid: true }
    : { valid: false, error: 'Please fill in the required fields before continuing.' }
}

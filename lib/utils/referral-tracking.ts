import apiClient from '@/lib/api/client'

/**
 * T271: Referral link validation and tracking utilities.
 */

const REFERRAL_STORAGE_KEY = 'karsaaz_referral_code'

/**
 * Purpose: Extract referral code from a URL string. Supports ?ref=CODE query parameter.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function extractReferralCode(url: string): string | null {
  try {
    const parsed = new URL(url, 'https://placeholder.com')
    return parsed.searchParams.get('ref') || null
  } catch {
    return null
  }
}

/**
 * Purpose: Validate a referral code against the backend.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function validateReferralCode(code: string): Promise<boolean> {
  if (!code || code.trim().length === 0) return false
  try {
    const response = await apiClient.get<{ valid: boolean }>('/referrals/validate', {
      params: { code },
    })
    return response.data?.valid === true
  } catch {
    return false
  }
}

/**
 * Purpose: Attribute a referral to a newly registered user.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function attributeReferral(userId: string, code: string): Promise<void> {
  await apiClient.post('/referrals/attribute', {
    user_id: userId,
    referral_code: code,
  })
}

/**
 * Purpose: Store referral code in localStorage for use during registration.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function storeReferralCode(code: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFERRAL_STORAGE_KEY, code)
  }
}

/**
 * Purpose: Retrieve stored referral code from localStorage.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getStoredReferralCode(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFERRAL_STORAGE_KEY)
  }
  return null
}

/**
 * Purpose: Clear stored referral code after successful attribution.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function clearStoredReferralCode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_STORAGE_KEY)
  }
}

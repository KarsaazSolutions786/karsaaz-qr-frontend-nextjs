import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import {
  extractReferralCode,
  validateReferralCode,
  storeReferralCode,
  getStoredReferralCode,
  clearStoredReferralCode,
} from '@/lib/utils/referral-tracking'
import apiClient from '@/lib/api/client'

describe('extractReferralCode', () => {
  it('extracts ref param from URL', () => {
    expect(extractReferralCode('https://example.com?ref=ABC123')).toBe('ABC123')
  })

  it('returns null when no ref param', () => {
    expect(extractReferralCode('https://example.com')).toBeNull()
  })

  it('returns null for invalid URL', () => {
    expect(extractReferralCode('')).toBeNull()
  })

  it('works with relative URLs', () => {
    expect(extractReferralCode('/register?ref=XYZ')).toBe('XYZ')
  })
})

describe('validateReferralCode', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset()
  })

  it('returns true for valid code', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { valid: true } })
    expect(await validateReferralCode('VALID')).toBe(true)
  })

  it('returns false for invalid code', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { valid: false } })
    expect(await validateReferralCode('INVALID')).toBe(false)
  })

  it('returns false for empty code', async () => {
    expect(await validateReferralCode('')).toBe(false)
  })

  it('returns false on API error', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network'))
    expect(await validateReferralCode('CODE')).toBe(false)
  })
})

describe('referral localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves referral code', () => {
    storeReferralCode('REF123')
    expect(getStoredReferralCode()).toBe('REF123')
  })

  it('clears stored referral code', () => {
    storeReferralCode('REF123')
    clearStoredReferralCode()
    expect(getStoredReferralCode()).toBeNull()
  })

  it('returns null when no code stored', () => {
    expect(getStoredReferralCode()).toBeNull()
  })
})

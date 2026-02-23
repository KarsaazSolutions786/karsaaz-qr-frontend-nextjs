import { describe, it, expect, vi } from 'vitest'

// Mock env-config before importing brand-url
vi.mock('@/lib/config/env-config', () => ({
  envConfig: {
    NODE_ENV: 'development',
    APP_URL: 'http://localhost:3000',
    API_URL: 'https://api.karsaazqr.com',
  },
}))

import { getProtocol, getBrandUrl, getApiUrl } from '@/lib/utils/brand-url'

describe('getProtocol', () => {
  it('returns http in development with http APP_URL', () => {
    expect(getProtocol()).toBe('http')
  })
})

describe('getBrandUrl', () => {
  it('returns base URL without path', () => {
    expect(getBrandUrl()).toBe('http://localhost:3000')
  })

  it('appends path to base URL', () => {
    expect(getBrandUrl('/dashboard')).toBe('http://localhost:3000/dashboard')
  })

  it('normalizes path without leading slash', () => {
    expect(getBrandUrl('dashboard')).toBe('http://localhost:3000/dashboard')
  })

  it('uses custom domain when provided', () => {
    const url = getBrandUrl('/page', 'custom.example.com')
    expect(url).toBe('http://custom.example.com/page')
  })

  it('strips protocol from custom domain', () => {
    const url = getBrandUrl('/page', 'https://custom.example.com')
    expect(url).toBe('http://custom.example.com/page')
  })
})

describe('getApiUrl', () => {
  it('returns base API URL with /api suffix', () => {
    expect(getApiUrl()).toBe('https://api.karsaazqr.com/api')
  })

  it('appends path to API URL', () => {
    expect(getApiUrl('/users')).toBe('https://api.karsaazqr.com/api/users')
  })

  it('normalizes path without leading slash', () => {
    expect(getApiUrl('users')).toBe('https://api.karsaazqr.com/api/users')
  })
})

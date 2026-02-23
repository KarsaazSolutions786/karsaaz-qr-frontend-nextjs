import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('env-config', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('provides default values when env vars are missing', async () => {
    const { envConfig } = await import('@/lib/config/env-config')
    expect(envConfig.APP_URL).toBeDefined()
    expect(envConfig.NODE_ENV).toBeDefined()
  })

  it('envConfig is frozen', async () => {
    const { envConfig } = await import('@/lib/config/env-config')
    expect(Object.isFrozen(envConfig)).toBe(true)
  })

  it('reads NEXT_PUBLIC_API_URL from env', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://custom-api.test'
    const { envConfig } = await import('@/lib/config/env-config')
    expect(envConfig.API_URL).toBe('https://custom-api.test')
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('parseBool handles true/false/1 values', async () => {
    process.env.NEXT_PUBLIC_ENABLE_PASSWORDLESS_AUTH = '1'
    process.env.NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM = 'false'
    const { envConfig } = await import('@/lib/config/env-config')
    expect(envConfig.ENABLE_PASSWORDLESS_AUTH).toBe(true)
    expect(envConfig.ENABLE_REFERRAL_SYSTEM).toBe(false)
    delete process.env.NEXT_PUBLIC_ENABLE_PASSWORDLESS_AUTH
    delete process.env.NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM
  })

  it('validateEnv returns missing required keys', async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_APP_URL
    const { validateEnv } = await import('@/lib/config/env-config')
    const missing = validateEnv()
    expect(missing).toContain('NEXT_PUBLIC_API_URL')
    expect(missing).toContain('NEXT_PUBLIC_APP_URL')
  })

  it('validateEnv returns empty array when all required vars present', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.test'
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.test'
    const { validateEnv } = await import('@/lib/config/env-config')
    const missing = validateEnv()
    expect(missing).toEqual([])
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_APP_URL
  })
})

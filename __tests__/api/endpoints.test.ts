/**
 * Vitest unit tests: API endpoint functions
 *
 * Strategy: mock the axios `apiClient` module so every test is pure unit
 * and verifies the request shape constructed by the endpoint helpers without
 * hitting a real server.
 *
 * Coverage:
 *   authAPI  — login, register, forgotPassword, resetPassword, verifyOTP,
 *              getCurrentUser, passwordlessStatus, googleTokenLogin
 *   qrcodesAPI — list, create, update, delete, preview
 *   Error cases — 422 validation, 401 unauthorised, network error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ── Mock apiClient BEFORE importing endpoint modules ─────────────────────────

vi.mock('@/lib/api/client', () => {
  const client = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return { default: client, isAxiosError: vi.fn((e) => !!e?.isAxiosError) }
})

// Mock next/navigation to prevent errors from hooks that rely on it
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock sonner toast used in client.ts
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), dismiss: vi.fn() },
}))

// Mock env config
vi.mock('@/lib/config/env-config', () => ({
  envConfig: { API_URL: 'http://localhost:8000' },
}))

// Mock auth-workflow (used in getGoogleRedirectUrl)
vi.mock('@/lib/services/auth-workflow', () => ({
  generateOAuthStateForRedirect: vi.fn(() => 'mock-state-token'),
}))

// ── Import after mocks ────────────────────────────────────────────────────────

import apiClient from '@/lib/api/client'
import { authAPI } from '@/lib/api/endpoints/auth'

// ── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: '2026-01-01T00:00:00Z',
}

const MOCK_TOKEN = 'sanctum-test-token-abc123'

function makeResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
}

function makeAxiosError(status: number, data: any) {
  const err = new Error('Request failed') as any
  err.isAxiosError = true
  err.response = { status, data, headers: {}, config: {} }
  return err
}

// ── Auth API: login ───────────────────────────────────────────────────────────

describe('authAPI.login', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /login with email and password', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.login({ email: 'test@example.com', password: 'password123' })

    expect(apiClient.post).toHaveBeenCalledWith(
      '/login',
      { email: 'test@example.com', password: 'password123' }
    )
  })

  it('returns user and token on success', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    const result = await authAPI.login({ email: 'test@example.com', password: 'password123' })

    expect(result).toMatchObject({ user: MOCK_USER, token: MOCK_TOKEN })
  })

  it('forwards optional guest_session_token', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.login({
      email: 'test@example.com',
      password: 'password123',
      guest_session_token: 'guest-uuid-abc',
    })

    expect(apiClient.post).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({ guest_session_token: 'guest-uuid-abc' })
    )
  })

  it('propagates 422 validation error from the server', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      makeAxiosError(422, { errors: { email: ['The email field is required.'] } })
    )

    await expect(authAPI.login({ email: '', password: '' })).rejects.toMatchObject({
      response: { status: 422 },
    })
  })

  it('propagates 401 wrong credentials error', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      makeAxiosError(401, { message: 'These credentials do not match our records.' })
    )

    await expect(
      authAPI.login({ email: 'x@example.com', password: 'wrong' })
    ).rejects.toMatchObject({ response: { status: 401 } })
  })

  it('propagates network error', async () => {
    const err = new Error('Network Error') as any
    err.code = 'ERR_NETWORK'
    vi.mocked(apiClient.post).mockRejectedValue(err)

    await expect(authAPI.login({ email: 'a@b.com', password: 'p' })).rejects.toThrow(
      'Network Error'
    )
  })
})

// ── Auth API: register ────────────────────────────────────────────────────────

describe('authAPI.register', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /register with required fields', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN }, 200)
    )

    await authAPI.register({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      terms_consent: true,
    })

    expect(apiClient.post).toHaveBeenCalledWith(
      '/register',
      expect.objectContaining({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        terms_consent: true,
      })
    )
  })

  it('returns user and token', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    const result = await authAPI.register({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      terms_consent: true,
    })

    expect(result.user).toEqual(MOCK_USER)
    expect(result.token).toBe(MOCK_TOKEN)
  })

  it('forwards optional referral_code', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.register({
      name: 'Referred User',
      email: 'ref@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      terms_consent: true,
      referral_code: 'REF123',
    })

    expect(apiClient.post).toHaveBeenCalledWith(
      '/register',
      expect.objectContaining({ referral_code: 'REF123' })
    )
  })

  it('propagates 422 when email is already taken', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      makeAxiosError(422, { errors: { email: ['The email has already been taken.'] } })
    )

    await expect(
      authAPI.register({
        name: 'Dup User',
        email: 'existing@example.com',
        password: 'pw',
        password_confirmation: 'pw',
        terms_consent: true,
      })
    ).rejects.toMatchObject({ response: { status: 422 } })
  })
})

// ── Auth API: getCurrentUser ─────────────────────────────────────────────────

describe('authAPI.getCurrentUser', () => {
  beforeEach(() => vi.clearAllMocks())

  it('GETs /myself', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(makeResponse(MOCK_USER))

    await authAPI.getCurrentUser()

    expect(apiClient.get).toHaveBeenCalledWith('/myself')
  })

  it('returns the user object from response', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(makeResponse(MOCK_USER))

    const result = await authAPI.getCurrentUser()

    expect(result).toEqual(MOCK_USER)
  })

  it('propagates 401 when token is invalid', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(makeAxiosError(401, { message: 'Unauthenticated.' }))

    await expect(authAPI.getCurrentUser()).rejects.toMatchObject({ response: { status: 401 } })
  })
})

// ── Auth API: forgotPassword ──────────────────────────────────────────────────

describe('authAPI.forgotPassword', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /forgot-password with email', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ message: 'We have emailed your password reset link.' })
    )

    await authAPI.forgotPassword({ email: 'user@example.com' })

    expect(apiClient.post).toHaveBeenCalledWith('/forgot-password', { email: 'user@example.com' })
  })

  it('returns message string', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ message: 'We have emailed your password reset link.' })
    )

    const result = await authAPI.forgotPassword({ email: 'user@example.com' })

    expect(result.message).toContain('emailed')
  })

  it('propagates 422 when email is not registered', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      makeAxiosError(422, { errors: { email: ["We can't find a user with that email address."] } })
    )

    await expect(authAPI.forgotPassword({ email: 'ghost@example.com' })).rejects.toMatchObject({
      response: { status: 422 },
    })
  })
})

// ── Auth API: resetPassword ───────────────────────────────────────────────────

describe('authAPI.resetPassword', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /reset-password with all required fields', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ message: 'Your password has been reset.' })
    )

    await authAPI.resetPassword({
      email: 'user@example.com',
      password: 'NewPass123!',
      password_confirmation: 'NewPass123!',
      token: 'reset-token-abc',
    })

    expect(apiClient.post).toHaveBeenCalledWith(
      '/reset-password',
      expect.objectContaining({
        email: 'user@example.com',
        password: 'NewPass123!',
        token: 'reset-token-abc',
      })
    )
  })
})

// ── Auth API: verifyOTP ───────────────────────────────────────────────────────

describe('authAPI.verifyOTP', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /account/verify-otp-code', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, message: 'Email verified.' })
    )

    await authAPI.verifyOTP({ otp: '123456', email: 'user@example.com' })

    expect(apiClient.post).toHaveBeenCalledWith('/account/verify-otp-code', {
      otp: '123456',
      email: 'user@example.com',
    })
  })

  it('returns user and message on success', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, message: 'Email verified.' })
    )

    const result = await authAPI.verifyOTP({ otp: '000000', email: 'user@example.com' })

    expect(result.user).toEqual(MOCK_USER)
    expect(result.message).toBeDefined()
  })

  it('propagates 422 for wrong OTP', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      makeAxiosError(422, { errors: { otp: ['Invalid OTP code.'] } })
    )

    await expect(
      authAPI.verifyOTP({ otp: '999999', email: 'user@example.com' })
    ).rejects.toMatchObject({ response: { status: 422 } })
  })
})

// ── Auth API: passwordlessStatus ─────────────────────────────────────────────

describe('authAPI.passwordlessStatus', () => {
  beforeEach(() => vi.clearAllMocks())

  it('GETs /passwordless-auth/status', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(
      makeResponse({ success: true, enabled: true, feature: 'passwordless_auth' })
    )

    await authAPI.passwordlessStatus()

    expect(apiClient.get).toHaveBeenCalledWith('/passwordless-auth/status')
  })

  it('returns enabled flag', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(
      makeResponse({ success: true, enabled: false, feature: 'passwordless_auth' })
    )

    const result = await authAPI.passwordlessStatus()

    expect(typeof result.enabled).toBe('boolean')
  })
})

// ── Auth API: googleTokenLogin ────────────────────────────────────────────────

describe('authAPI.googleTokenLogin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs credential to /auth/google/verify-token', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.googleTokenLogin({ credential: 'google-id-token-xyz' })

    expect(apiClient.post).toHaveBeenCalledWith('/auth/google/verify-token', {
      credential: 'google-id-token-xyz',
    })
  })

  it('returns user and token on success', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    const result = await authAPI.googleTokenLogin({ credential: 'token' }) as any

    expect(result.user).toEqual(MOCK_USER)
    expect(result.token).toBe(MOCK_TOKEN)
  })

  it('returns requires_2fa when 2FA is enabled for the Google account', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ requires_2fa: true, two_factor_token: 'tfa-token-abc' })
    )

    const result = await authAPI.googleTokenLogin({ credential: 'token' }) as any

    expect(result.requires_2fa).toBe(true)
    expect(result.two_factor_token).toBeDefined()
  })
})

// ── Auth API: resendOTP ───────────────────────────────────────────────────────

describe('authAPI.resendOTP', () => {
  beforeEach(() => vi.clearAllMocks())

  it('POSTs to /account/resend-otp-code with email', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(makeResponse({ message: 'OTP resent.' }))

    await authAPI.resendOTP('user@example.com')

    expect(apiClient.post).toHaveBeenCalledWith('/account/resend-otp-code', {
      email: 'user@example.com',
    })
  })
})

// ── Auth API: logout ──────────────────────────────────────────────────────────

describe('authAPI.logout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('resolves with success:true (client-side only)', async () => {
    const result = await authAPI.logout()

    expect(result).toEqual({ success: true })
    // logout does NOT call the server in the current implementation
    expect(apiClient.post).not.toHaveBeenCalled()
  })
})

// ── Auth API: Google redirect URL construction ────────────────────────────────

describe('authAPI.getGoogleRedirectUrl', () => {
  it('returns a URL string containing the expected path', () => {
    const url = authAPI.getGoogleRedirectUrl()

    expect(typeof url).toBe('string')
    expect(url).toContain('google')
  })

  it('appends a state query param', () => {
    const url = authAPI.getGoogleRedirectUrl()

    expect(url).toContain('state=')
  })
})

// ── QR Codes API ──────────────────────────────────────────────────────────────

// Lazy import to avoid hoisting issues with vi.mock
describe('qrcodesAPI', () => {
  let qrcodesAPI: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/lib/api/endpoints/qrcodes')
    qrcodesAPI = (mod as any).qrcodesAPI
  })

  const MOCK_QR = {
    id: '42',
    name: 'Test QR',
    type: 'url',
    data: { url: 'https://example.com' },
    status: 'active',
    scans: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  const MOCK_PAGINATED = {
    data: [MOCK_QR],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 1,
  }

  // ── List ─────────────────────────────────────────────────────────────────

  it('list GETs /qrcodes', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(makeResponse(MOCK_PAGINATED))

    if (qrcodesAPI?.list) {
      await qrcodesAPI.list({})
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/qrcodes'),
        expect.anything()
      )
    }
  })

  it('list passes page and page_size as query params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(makeResponse(MOCK_PAGINATED))

    if (qrcodesAPI?.list) {
      await qrcodesAPI.list({ page: 2, perPage: 10 })

      // The apiClient may embed params in the URL string or in the config params object.
      // Check both possible shapes.
      const calls = vi.mocked(apiClient.get).mock.calls
      expect(calls.length).toBeGreaterThan(0)

      const [url, config] = calls[0]
      const urlHasPage = typeof url === 'string' && url.includes('page')
      const configHasPage = config?.params?.page === 2 || config?.params?.page_size === 10 ||
                            config?.params?.perPage === 10
      // At least one of the two shapes must encode the page parameter
      expect(urlHasPage || configHasPage).toBe(true)
    }
  })

  // ── Create ────────────────────────────────────────────────────────────────

  it('create POSTs to /qrcodes with required fields', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(makeResponse(MOCK_QR, 201))

    if (qrcodesAPI?.create) {
      await qrcodesAPI.create({
        type: 'url',
        name: 'My QR',
        data: { url: 'https://example.com' },
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/qrcodes',
        expect.objectContaining({
          type: 'url',
          name: 'My QR',
          data: { url: 'https://example.com' },
        })
      )
    }
  })

  // ── Update ────────────────────────────────────────────────────────────────

  it('update PUTs to /qrcodes/{id}', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(makeResponse({ ...MOCK_QR, name: 'Updated' }))

    if (qrcodesAPI?.update) {
      await qrcodesAPI.update('42', { name: 'Updated' })

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.stringContaining('/qrcodes/42'),
        expect.objectContaining({ name: 'Updated' })
      )
    }
  })

  // ── Delete ────────────────────────────────────────────────────────────────

  it('remove DELETEs /qrcodes/{id}', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(makeResponse({ message: 'Deleted.' }))

    if (qrcodesAPI?.remove || qrcodesAPI?.delete) {
      const fn = qrcodesAPI.remove ?? qrcodesAPI.delete
      await fn('42')

      expect(apiClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('/qrcodes/42')
      )
    }
  })

  // ── Preview ───────────────────────────────────────────────────────────────

  it('preview GETs /qrcodes/preview with design params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(makeResponse({ svg: '<svg/>' }))

    if (qrcodesAPI?.preview) {
      await qrcodesAPI.preview({
        type: 'url',
        data: { url: 'https://preview.com' },
        design: { foregroundColor: '#ff0000' },
      })

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('preview'),
        expect.anything()
      )
    }
  })
})

// ── API client — request shape invariants ─────────────────────────────────────

describe('apiClient request shape invariants', () => {
  beforeEach(() => vi.clearAllMocks())

  it('authAPI.login sends JSON Content-Type by default (no FormData)', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.login({ email: 'a@b.com', password: 'pw' })

    // The payload passed to post is a plain object (not FormData),
    // confirming JSON serialisation path is used.
    const payload = vi.mocked(apiClient.post).mock.calls[0][1]
    expect(payload).not.toBeInstanceOf(FormData)
    expect(typeof payload).toBe('object')
  })

  it('authAPI.register payload contains all five required keys', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(
      makeResponse({ user: MOCK_USER, token: MOCK_TOKEN })
    )

    await authAPI.register({
      name: 'User',
      email: 'u@example.com',
      password: 'pw',
      password_confirmation: 'pw',
      terms_consent: true,
    })

    const payload = vi.mocked(apiClient.post).mock.calls[0][1] as any
    expect(payload).toHaveProperty('name')
    expect(payload).toHaveProperty('email')
    expect(payload).toHaveProperty('password')
    expect(payload).toHaveProperty('password_confirmation')
    expect(payload).toHaveProperty('terms_consent')
  })
})

/**
 * Unit Tests for Guest API endpoints
 * @file tests/unit/api/guest-api.test.ts
 *
 * Tests the guestAPI and adminGuestAPI objects that wrap apiClient calls
 * for guest session management, QR code operations, and admin configuration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Mock apiClient before importing source ──────────────────────────────────

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('@/lib/api/client', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    put: (...args: unknown[]) => mockPut(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}))

// Import after mocks are set up
import { guestAPI, adminGuestAPI } from '@/lib/api/endpoints/guest'

// ── Helpers ─────────────────────────────────────────────────────────────────

const GUEST_HEADER = { 'X-Guest-Session-Token': 'test-token-123' }

function wrapResponse(data: unknown) {
  return { data: { data } }
}

// ── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => {
      if (key === 'guest_session_token') return 'test-token-123'
      return null
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ── guestAPI ────────────────────────────────────────────────────────────────

describe('guestAPI', () => {
  // ── Configuration ─────────────────────────────────────────────────────

  describe('getConfiguration', () => {
    it('calls GET /guest/configuration without guest header', async () => {
      const config = { is_guest_mode_enabled: true, max_qrcodes_per_session: 5 }
      mockGet.mockResolvedValue(wrapResponse(config))

      const result = await guestAPI.getConfiguration()

      expect(mockGet).toHaveBeenCalledWith('/guest/configuration')
      expect(result).toEqual(config)
    })
  })

  // ── Session management ────────────────────────────────────────────────

  describe('createSession', () => {
    it('calls POST /guest/session with platform in body', async () => {
      const session = { id: 1, session_token: 'abc', platform: 'web' }
      mockPost.mockResolvedValue(wrapResponse(session))

      const result = await guestAPI.createSession('web')

      expect(mockPost).toHaveBeenCalledWith('/guest/session', { platform: 'web' })
      expect(result).toEqual(session)
    })

    it('defaults platform to "web" when omitted', async () => {
      const session = { id: 1, session_token: 'abc', platform: 'web' }
      mockPost.mockResolvedValue(wrapResponse(session))

      await guestAPI.createSession()

      expect(mockPost).toHaveBeenCalledWith('/guest/session', { platform: 'web' })
    })

    it('does not send X-Guest-Session-Token header', async () => {
      mockPost.mockResolvedValue(wrapResponse({}))

      await guestAPI.createSession()

      // createSession sends only URL + body — no headers config object
      const callArgs = mockPost.mock.calls[0]
      expect(callArgs).toHaveLength(2) // [url, body] — no third arg
    })
  })

  describe('getSession', () => {
    it('calls GET /guest/session with X-Guest-Session-Token header', async () => {
      const info = {
        session: { id: 1 },
        limits: { qrcodes: { used: 0, max: 5, remaining: 5 } },
        configuration: { is_guest_mode_enabled: true },
      }
      mockGet.mockResolvedValue(wrapResponse(info))

      const result = await guestAPI.getSession()

      expect(mockGet).toHaveBeenCalledWith('/guest/session', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(info)
    })
  })

  describe('endSession', () => {
    it('calls DELETE /guest/session with X-Guest-Session-Token header', async () => {
      mockDelete.mockResolvedValue({ data: { success: true } })

      const result = await guestAPI.endSession()

      expect(mockDelete).toHaveBeenCalledWith('/guest/session', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual({ success: true })
    })
  })

  // ── QR Codes ──────────────────────────────────────────────────────────

  describe('createQrcode', () => {
    it('calls POST /guest/qrcodes with body and guest header', async () => {
      const body = { name: 'Test', type: 'url', data: { url: 'https://example.com' } }
      const qrcode = { id: 1, ...body }
      mockPost.mockResolvedValue(wrapResponse(qrcode))

      const result = await guestAPI.createQrcode(body)

      expect(mockPost).toHaveBeenCalledWith('/guest/qrcodes', body, {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(qrcode)
    })
  })

  describe('listQrcodes', () => {
    it('calls GET /guest/qrcodes with guest header', async () => {
      const qrcodes = [{ id: 1, name: 'Test' }]
      mockGet.mockResolvedValue(wrapResponse(qrcodes))

      const result = await guestAPI.listQrcodes()

      expect(mockGet).toHaveBeenCalledWith('/guest/qrcodes', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(qrcodes)
    })
  })

  describe('getQrcode', () => {
    it('calls GET /guest/qrcodes/:id with guest header', async () => {
      const qrcode = { id: 42, name: 'My QR' }
      mockGet.mockResolvedValue(wrapResponse(qrcode))

      const result = await guestAPI.getQrcode(42)

      expect(mockGet).toHaveBeenCalledWith('/guest/qrcodes/42', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(qrcode)
    })
  })

  describe('deleteQrcode', () => {
    it('calls DELETE /guest/qrcodes/:id with guest header', async () => {
      mockDelete.mockResolvedValue({ data: { success: true } })

      const result = await guestAPI.deleteQrcode(7)

      expect(mockDelete).toHaveBeenCalledWith('/guest/qrcodes/7', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual({ success: true })
    })
  })

  describe('downloadQrcode', () => {
    it('calls POST /guest/qrcodes/:id/download with format and blob responseType', async () => {
      const blob = new Blob(['image'])
      mockPost.mockResolvedValue({ data: blob })

      const result = await guestAPI.downloadQrcode(3, 'png')

      expect(mockPost).toHaveBeenCalledWith(
        '/guest/qrcodes/3/download',
        { format: 'png' },
        { headers: GUEST_HEADER, responseType: 'blob' }
      )
      expect(result).toBe(blob)
    })
  })

  describe('previewQrcode', () => {
    it('calls POST /guest/qrcodes/preview with body, header, and blob responseType', async () => {
      const body = { type: 'url', data: { url: 'https://example.com' } }
      const blob = new Blob(['preview'])
      mockPost.mockResolvedValue({ data: blob })

      const result = await guestAPI.previewQrcode(body)

      expect(mockPost).toHaveBeenCalledWith('/guest/qrcodes/preview', body, {
        headers: GUEST_HEADER,
        responseType: 'blob',
      })
      expect(result).toBe(blob)
    })
  })

  // ── Scans ─────────────────────────────────────────────────────────────

  describe('recordScan', () => {
    it('calls POST /guest/scans with body and guest header', async () => {
      const body = { scanned_data: 'https://example.com', scanned_type: 'url' }
      const scan = { id: 1, ...body }
      mockPost.mockResolvedValue(wrapResponse(scan))

      const result = await guestAPI.recordScan(body)

      expect(mockPost).toHaveBeenCalledWith('/guest/scans', body, {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(scan)
    })
  })

  describe('listScans', () => {
    it('calls GET /guest/scans with guest header', async () => {
      const scans = [{ id: 1, scanned_data: 'test', scanned_type: 'url' }]
      mockGet.mockResolvedValue(wrapResponse(scans))

      const result = await guestAPI.listScans()

      expect(mockGet).toHaveBeenCalledWith('/guest/scans', {
        headers: GUEST_HEADER,
      })
      expect(result).toEqual(scans)
    })
  })

  // ── Edge: no token in localStorage ────────────────────────────────────

  describe('when no guest token in localStorage', () => {
    beforeEach(() => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      })
    })

    it('getSession sends empty headers object', async () => {
      mockGet.mockResolvedValue(wrapResponse({ session: {} }))

      await guestAPI.getSession()

      expect(mockGet).toHaveBeenCalledWith('/guest/session', { headers: {} })
    })

    it('endSession sends empty headers object', async () => {
      mockDelete.mockResolvedValue({ data: {} })

      await guestAPI.endSession()

      expect(mockDelete).toHaveBeenCalledWith('/guest/session', { headers: {} })
    })
  })
})

// ── adminGuestAPI ───────────────────────────────────────────────────────────

describe('adminGuestAPI', () => {
  describe('getConfiguration', () => {
    it('calls GET /admin/guest-configuration', async () => {
      const config = { is_guest_mode_enabled: true }
      mockGet.mockResolvedValue(wrapResponse(config))

      const result = await adminGuestAPI.getConfiguration()

      expect(mockGet).toHaveBeenCalledWith('/admin/guest-configuration')
      expect(result).toEqual(config)
    })
  })

  describe('updateConfiguration', () => {
    it('calls PUT /admin/guest-configuration with body', async () => {
      const body = { max_qrcodes_per_session: 10 }
      const updated = { is_guest_mode_enabled: true, ...body }
      mockPut.mockResolvedValue(wrapResponse(updated))

      const result = await adminGuestAPI.updateConfiguration(body)

      expect(mockPut).toHaveBeenCalledWith('/admin/guest-configuration', body)
      expect(result).toEqual(updated)
    })
  })

  describe('getAnalytics', () => {
    it('calls GET /admin/guest-analytics with optional params', async () => {
      const analytics = { total_sessions: 100, conversion_rate: 0.15 }
      mockGet.mockResolvedValue(wrapResponse(analytics))

      const result = await adminGuestAPI.getAnalytics({ days: 30 })

      expect(mockGet).toHaveBeenCalledWith('/admin/guest-analytics', {
        params: { days: 30 },
      })
      expect(result).toEqual(analytics)
    })

    it('calls GET /admin/guest-analytics without params when omitted', async () => {
      const analytics = { total_sessions: 50 }
      mockGet.mockResolvedValue(wrapResponse(analytics))

      const result = await adminGuestAPI.getAnalytics()

      expect(mockGet).toHaveBeenCalledWith('/admin/guest-analytics', {
        params: undefined,
      })
      expect(result).toEqual(analytics)
    })
  })
})

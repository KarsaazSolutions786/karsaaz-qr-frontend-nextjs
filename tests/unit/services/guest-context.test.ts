/**
 * Unit Tests for GuestContext / GuestProvider
 * @file tests/unit/services/guest-context.test.ts
 *
 * Tests the GuestProvider's internal logic including session creation,
 * localStorage management, action counting, and signup prompt triggering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'

// ── Mock dependencies before imports ────────────────────────────────────────

// useAuth mock — override per test
const mockUseAuth = vi.fn()
vi.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// guestAPI mock
const mockGetConfiguration = vi.fn()
const mockCreateSession = vi.fn()
const mockGetSession = vi.fn()
const mockEndSession = vi.fn()

vi.mock('@/lib/api/endpoints/guest', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/endpoints/guest')>()
  return {
    ...actual,
    guestAPI: {
      getConfiguration: (...args: unknown[]) => mockGetConfiguration(...args),
      createSession: (...args: unknown[]) => mockCreateSession(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      endSession: (...args: unknown[]) => mockEndSession(...args),
      listQrcodes: vi.fn(),
      deleteQrcode: vi.fn(),
      createQrcode: vi.fn(),
    },
  }
})

import { GuestProvider } from '@/lib/context/GuestContext'
import { useGuest } from '@/lib/hooks/useGuest'

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(GuestProvider, null, children)
}

const mockLocalStorage: Record<string, string> = {}

function setupLocalStorage(initial: Record<string, string> = {}) {
  Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k])
  Object.assign(mockLocalStorage, initial)

  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
    setItem: vi.fn((key: string, val: string) => {
      mockLocalStorage[key] = val
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage[key]
    }),
  })
}

// ── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  setupLocalStorage()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ── Tests ───────────────────────────────────────────────────────────────────

describe('GuestProvider', () => {
  describe('initialization with authenticated user', () => {
    it('sets isGuest to false when user is authenticated', async () => {
      mockUseAuth.mockReturnValue({ user: { id: 1, name: 'Alice' }, isLoading: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.isGuest).toBe(false)
      expect(result.current.guestSession).toBeNull()
    })

    it('does not create a guest session when user is logged in', async () => {
      mockUseAuth.mockReturnValue({ user: { id: 1 }, isLoading: false })

      renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(mockCreateSession).not.toHaveBeenCalled()
      })
    })
  })

  describe('guest session lifecycle', () => {
    it('creates a guest session when no user and guest mode enabled', async () => {
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: true })
      mockCreateSession.mockResolvedValue({
        id: 1,
        session_token: 'new-token',
        platform: 'web',
      })
      mockGetSession.mockResolvedValue({
        session: { id: 1, session_token: 'new-token' },
        limits: { qrcodes: { used: 0, max: 5, remaining: 5 } },
        configuration: { is_guest_mode_enabled: true },
      })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(mockCreateSession).toHaveBeenCalledWith('web')
    })

    it('stores guest_session_token in localStorage after session creation', async () => {
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: true })
      mockCreateSession.mockResolvedValue({
        id: 1,
        session_token: 'new-token-xyz',
        platform: 'web',
      })
      mockGetSession.mockResolvedValue({
        session: { id: 1 },
        limits: {},
        configuration: { is_guest_mode_enabled: true },
      })

      renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'guest_session_token',
          'new-token-xyz'
        )
      })
    })

    it('validates existing token on init', async () => {
      setupLocalStorage({ guest_session_token: 'existing-token' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetSession.mockResolvedValue({
        session: { id: 99, session_token: 'existing-token' },
        limits: { qrcodes: { used: 1, max: 5, remaining: 4 } },
        configuration: { is_guest_mode_enabled: true },
      })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      // Should have tried getSession (validate) but NOT createSession
      expect(mockGetSession).toHaveBeenCalled()
      expect(mockCreateSession).not.toHaveBeenCalled()
    })

    it('does not create session when guest mode is disabled', async () => {
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(mockCreateSession).not.toHaveBeenCalled()
      expect(result.current.isGuest).toBe(false)
    })
  })

  describe('action count and signup prompt', () => {
    it('increments action count correctly', async () => {
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.guestActionCount).toBe(0)

      act(() => {
        result.current.incrementActionCount()
      })

      expect(result.current.guestActionCount).toBe(1)
    })

    it('persists action count to localStorage', async () => {
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      act(() => {
        result.current.incrementActionCount()
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('guest_action_count', '1')
    })

    it('initializes action count from localStorage', async () => {
      setupLocalStorage({ guest_action_count: '5' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.guestActionCount).toBe(5)
    })

    it('shouldShowSignupPrompt is false when not a guest', async () => {
      mockUseAuth.mockReturnValue({ user: { id: 1 }, isLoading: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.shouldShowSignupPrompt).toBe(false)
    })

    it('shouldShowSignupPrompt triggers after configured action count', async () => {
      setupLocalStorage({ guest_session_token: 'tok' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })

      // Return session with show_signup_prompt_after = 2
      mockGetSession.mockResolvedValue({
        session: { id: 1, session_token: 'tok' },
        limits: { qrcodes: { used: 0, max: 5, remaining: 5 } },
        configuration: {
          is_guest_mode_enabled: true,
          show_signup_prompt_after: 2,
        },
      })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      // Initially action count = 0, prompt not shown
      expect(result.current.shouldShowSignupPrompt).toBe(false)

      // Increment twice to hit the threshold
      act(() => {
        result.current.incrementActionCount()
      })
      act(() => {
        result.current.incrementActionCount()
      })

      expect(result.current.guestActionCount).toBe(2)
      expect(result.current.shouldShowSignupPrompt).toBe(true)
    })
  })

  describe('endGuestSession', () => {
    it('clears localStorage on endGuestSession', async () => {
      setupLocalStorage({ guest_session_token: 'tok', guest_action_count: '3' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetSession.mockResolvedValue({
        session: { id: 1, session_token: 'tok' },
        limits: {},
        configuration: { is_guest_mode_enabled: true },
      })
      mockEndSession.mockResolvedValue({})

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      await act(async () => {
        await result.current.endGuestSession()
      })

      expect(localStorage.removeItem).toHaveBeenCalledWith('guest_session_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('guest_action_count')
    })

    it('resets session state after ending', async () => {
      setupLocalStorage({ guest_session_token: 'tok' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetSession.mockResolvedValue({
        session: { id: 1, session_token: 'tok' },
        limits: { qrcodes: { used: 1, max: 5, remaining: 4 } },
        configuration: { is_guest_mode_enabled: true },
      })
      mockEndSession.mockResolvedValue({})

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      await act(async () => {
        await result.current.endGuestSession()
      })

      expect(result.current.guestSession).toBeNull()
      expect(result.current.sessionLimits).toBeNull()
      expect(result.current.guestActionCount).toBe(0)
    })

    it('calls guestAPI.endSession on the backend', async () => {
      setupLocalStorage({ guest_session_token: 'tok' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetSession.mockResolvedValue({
        session: { id: 1, session_token: 'tok' },
        limits: {},
        configuration: { is_guest_mode_enabled: true },
      })
      mockEndSession.mockResolvedValue({})

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      await act(async () => {
        await result.current.endGuestSession()
      })

      expect(mockEndSession).toHaveBeenCalled()
    })
  })

  describe('getGuestToken', () => {
    it('returns token from localStorage', async () => {
      setupLocalStorage({ guest_session_token: 'my-guest-token' })
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.getGuestToken()).toBe('my-guest-token')
    })

    it('returns null when no token in localStorage', async () => {
      setupLocalStorage({})
      mockUseAuth.mockReturnValue({ user: null, isLoading: false })
      mockGetConfiguration.mockResolvedValue({ is_guest_mode_enabled: false })

      const { result } = renderHook(() => useGuest(), { wrapper: makeWrapper() })

      await waitFor(() => {
        expect(result.current.isGuestLoading).toBe(false)
      })

      expect(result.current.getGuestToken()).toBeNull()
    })
  })
})

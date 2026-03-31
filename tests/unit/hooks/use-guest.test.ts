/**
 * Unit Tests for useGuest hook
 * @file tests/unit/hooks/use-guest.test.ts
 *
 * Tests that useGuest correctly consumes GuestContext and throws
 * when used outside of GuestProvider.
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'

// ── Mock dependencies ───────────────────────────────────────────────────────

// Mock useAuth so GuestProvider can initialize
vi.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}))

// Mock guestAPI so provider doesn't make real network calls
vi.mock('@/lib/api/endpoints/guest', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/endpoints/guest')>()
  return {
    ...actual,
    guestAPI: {
      getConfiguration: vi.fn().mockResolvedValue({ is_guest_mode_enabled: false }),
      createSession: vi.fn(),
      getSession: vi.fn(),
      endSession: vi.fn(),
    },
  }
})

import { useGuest } from '@/lib/hooks/useGuest'
import { GuestProvider } from '@/lib/context/GuestContext'

// ── Tests ───────────────────────────────────────────────────────────────────

describe('useGuest', () => {
  it('throws error when used outside GuestProvider', () => {
    // Suppress console.error from the expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useGuest())
    }).toThrow('useGuest must be used within GuestProvider')

    spy.mockRestore()
  })

  it('returns context values when used inside GuestProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GuestProvider, null, children)

    const { result } = renderHook(() => useGuest(), { wrapper })

    // Verify shape of returned context
    expect(result.current).toHaveProperty('isGuest')
    expect(result.current).toHaveProperty('guestSession')
    expect(result.current).toHaveProperty('guestConfig')
    expect(result.current).toHaveProperty('sessionLimits')
    expect(result.current).toHaveProperty('isGuestLoading')
    expect(result.current).toHaveProperty('guestActionCount')
    expect(result.current).toHaveProperty('shouldShowSignupPrompt')
    expect(typeof result.current.incrementActionCount).toBe('function')
    expect(typeof result.current.endGuestSession).toBe('function')
    expect(typeof result.current.getGuestToken).toBe('function')
    expect(typeof result.current.refreshSession).toBe('function')
  })

  it('returns isGuest=false when no session is established', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GuestProvider, null, children)

    const { result } = renderHook(() => useGuest(), { wrapper })

    // No user + no session yet = isGuest is false during initial load
    expect(result.current.isGuest).toBe(false)
  })
})

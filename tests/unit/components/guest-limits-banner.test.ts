/**
 * Unit Tests for GuestLimitsBanner component
 * @file tests/unit/components/guest-limits-banner.test.ts
 *
 * Tests that the GuestLimitsBanner renders limit information correctly
 * for QR codes, downloads, and scans.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import type { GuestSessionInfo } from '@/lib/api/endpoints/guest'

// ── Mock i18n ───────────────────────────────────────────────────────────────

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

import { GuestLimitsBanner } from '@/components/guest/GuestLimitsBanner'

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeLimits(
  overrides?: Partial<GuestSessionInfo['limits']>
): GuestSessionInfo['limits'] {
  return {
    qrcodes: { used: 2, max: 5, remaining: 3 },
    downloads: { used: 1, max: 10, remaining: 9 },
    scans: { used: 0, max: 20, remaining: 20 },
    ...overrides,
  }
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('GuestLimitsBanner', () => {
  it('renders QR code limit correctly', () => {
    const limits = makeLimits({
      qrcodes: { used: 2, max: 5, remaining: 3 },
    })

    render(React.createElement(GuestLimitsBanner, { limits }))

    expect(screen.getByText(/3\/5/)).toBeTruthy()
    expect(screen.getByText(/QR Codes/)).toBeTruthy()
  })

  it('renders download limit correctly', () => {
    const limits = makeLimits({
      downloads: { used: 4, max: 10, remaining: 6 },
    })

    render(React.createElement(GuestLimitsBanner, { limits }))

    expect(screen.getByText(/6\/10/)).toBeTruthy()
    expect(screen.getByText(/Downloads/)).toBeTruthy()
  })

  it('renders scan limit correctly', () => {
    const limits = makeLimits({
      scans: { used: 15, max: 20, remaining: 5 },
    })

    render(React.createElement(GuestLimitsBanner, { limits }))

    expect(screen.getByText(/5\/20/)).toBeTruthy()
    expect(screen.getByText(/Scans/)).toBeTruthy()
  })

  it('renders all three limit categories simultaneously', () => {
    const limits = makeLimits()

    render(React.createElement(GuestLimitsBanner, { limits }))

    // All three labels should appear
    expect(screen.getByText(/QR Codes/)).toBeTruthy()
    expect(screen.getByText(/Downloads/)).toBeTruthy()
    expect(screen.getByText(/Scans/)).toBeTruthy()
  })

  it('renders "remaining" text for each category', () => {
    const limits = makeLimits()

    render(React.createElement(GuestLimitsBanner, { limits }))

    const remainingElements = screen.getAllByText(/remaining/)
    expect(remainingElements.length).toBe(3)
  })

  it('renders correctly when limits are at zero', () => {
    const limits = makeLimits({
      qrcodes: { used: 5, max: 5, remaining: 0 },
      downloads: { used: 10, max: 10, remaining: 0 },
      scans: { used: 20, max: 20, remaining: 0 },
    })

    render(React.createElement(GuestLimitsBanner, { limits }))

    expect(screen.getByText(/0\/5/)).toBeTruthy()
    expect(screen.getByText(/0\/10/)).toBeTruthy()
    expect(screen.getByText(/0\/20/)).toBeTruthy()
  })

  it('renders the blue banner container', () => {
    const limits = makeLimits()

    const { container } = render(
      React.createElement(GuestLimitsBanner, { limits })
    )

    const banner = container.firstChild as HTMLElement
    expect(banner.className).toContain('bg-blue-50')
    expect(banner.className).toContain('border-blue-200')
  })
})

/**
 * Unit Tests for GuestSignupPrompt component
 * @file tests/unit/components/guest-signup-prompt.test.ts
 *
 * Tests the signup prompt banner that appears to guest users
 * after a configured number of actions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'

// ── Mock dependencies ───────────────────────────────────────────────────────

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock next/link to render a plain <a>
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}))

// Mock Button component to render a plain <button>
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    [key: string]: unknown
  }) => React.createElement('button', { onClick, ...props }, children),
}))

// useGuest mock — we'll override per test
const mockUseGuest = vi.fn()
vi.mock('@/lib/hooks/useGuest', () => ({
  useGuest: () => mockUseGuest(),
}))

import { GuestSignupPrompt } from '@/components/guest/GuestSignupPrompt'

// ── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

// ── Tests ───────────────────────────────────────────────────────────────────

describe('GuestSignupPrompt', () => {
  it('renders nothing when shouldShowSignupPrompt is false', () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: false,
      guestConfig: null,
    })

    const { container } = render(React.createElement(GuestSignupPrompt))

    expect(container.innerHTML).toBe('')
  })

  it('renders prompt content when shouldShowSignupPrompt is true', () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    render(React.createElement(GuestSignupPrompt))

    // Should render the default message and buttons
    expect(
      screen.getByText(/Sign up to save your QR codes and unlock more features!/)
    ).toBeTruthy()
    expect(screen.getByText('Sign Up')).toBeTruthy()
    expect(screen.getByText('Maybe Later')).toBeTruthy()
  })

  it('renders custom message from guestConfig', () => {
    const customMsg = 'Create an account for unlimited QR codes!'
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: customMsg },
    })

    render(React.createElement(GuestSignupPrompt))

    expect(screen.getByText(new RegExp(customMsg))).toBeTruthy()
  })

  it('renders default message when guestConfig has no custom message', () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    render(React.createElement(GuestSignupPrompt))

    expect(
      screen.getByText(/Sign up to save your QR codes and unlock more features!/)
    ).toBeTruthy()
  })

  it('hides prompt after dismiss button is clicked', async () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    const { container } = render(React.createElement(GuestSignupPrompt))

    const dismissButton = screen.getByText('Maybe Later')
    await act(async () => {
      fireEvent.click(dismissButton)
    })

    // After dismissal the component returns null
    expect(container.innerHTML).toBe('')
  })

  it('stores dismissal in sessionStorage', async () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    render(React.createElement(GuestSignupPrompt))

    const dismissButton = screen.getByText('Maybe Later')
    await act(async () => {
      fireEvent.click(dismissButton)
    })

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'guest_signup_prompt_dismissed',
      'true'
    )
  })

  it('does not render when previously dismissed in sessionStorage', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn((key: string) => {
        if (key === 'guest_signup_prompt_dismissed') return 'true'
        return null
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    })

    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    const { container } = render(React.createElement(GuestSignupPrompt))

    expect(container.innerHTML).toBe('')
  })

  it('renders a link to /signup', () => {
    mockUseGuest.mockReturnValue({
      shouldShowSignupPrompt: true,
      guestConfig: { signup_prompt_message: null },
    })

    render(React.createElement(GuestSignupPrompt))

    const link = screen.getByText('Sign Up').closest('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('href')).toBe('/signup')
  })
})

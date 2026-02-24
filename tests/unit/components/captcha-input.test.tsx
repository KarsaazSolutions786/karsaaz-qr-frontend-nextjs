/**
 * Unit Tests for CaptchaInput Components
 * @file tests/unit/components/captcha-input.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageCaptcha, GoogleRecaptcha, CaptchaInput } from '@/components/ui/captcha-input'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ImageCaptcha', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          image: 'data:image/png;base64,testimage',
          session_key: 'test-session-123',
        }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render with label', async () => {
    render(<ImageCaptcha label="Verify You Are Human" />)
    expect(screen.getByText('Verify You Are Human')).toBeInTheDocument()
  })

  it('should render code input field', async () => {
    render(<ImageCaptcha placeholder="Enter code" />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter code')).toBeInTheDocument()
    })
  })

  it('should fetch captcha image on mount', async () => {
    render(<ImageCaptcha fetchUrl="/api/test-captcha" />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/test-captcha')
    })
  })

  it('should display captcha image after fetch', async () => {
    render(<ImageCaptcha />)

    await waitFor(() => {
      const img = screen.getByAltText('Captcha')
      expect(img).toHaveAttribute('src', 'data:image/png;base64,testimage')
    })
  })

  it('should call onChange when code is entered', async () => {
    const handleChange = vi.fn()
    render(<ImageCaptcha onChange={handleChange} />)

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'ABC123' } })

    expect(handleChange).toHaveBeenCalledWith({
      code: 'ABC123',
      session_key: 'test-session-123',
    })
  })

  it('should render refresh button', async () => {
    render(<ImageCaptcha differentImageText="Get new image" />)
    expect(screen.getByText('Get new image')).toBeInTheDocument()
  })

  it('should fetch new captcha when refresh is clicked', async () => {
    render(<ImageCaptcha />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const refreshButton = screen.getByRole('button')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it('should display error message', () => {
    render(<ImageCaptcha error="Invalid captcha code" />)
    expect(screen.getByText('Invalid captcha code')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', async () => {
    render(<ImageCaptcha disabled />)

    await waitFor(() => {
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    const refreshButton = screen.getByRole('button')
    expect(refreshButton).toBeDisabled()
  })

  it('should show loading state', () => {
    // Don't resolve fetch immediately
    mockFetch.mockImplementation(() => new Promise(() => {}))

    render(<ImageCaptcha />)

    // Should show spinner while loading
    expect(screen.queryByAltText('Captcha')).not.toBeInTheDocument()
  })

  it('should handle fetch failure gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<ImageCaptcha />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument()
    })
  })

  it('should apply custom className', () => {
    const { container } = render(<ImageCaptcha className="custom-captcha" />)
    expect(container.firstChild).toHaveClass('custom-captcha')
  })

  it('should accept name prop', async () => {
    render(<ImageCaptcha name="custom-captcha-name" />)

    await waitFor(() => {
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'custom-captcha-name')
    })
  })
})

describe('GoogleRecaptcha', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear any existing scripts
    document.head.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // @ts-expect-error cleaning up mock
    delete window.grecaptcha
  })

  it('should render container div', () => {
    const { container } = render(<GoogleRecaptcha siteKey="test-site-key" />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('should display error message', () => {
    render(<GoogleRecaptcha siteKey="test-site-key" error="Please complete captcha" />)
    expect(screen.getByText('Please complete captcha')).toBeInTheDocument()
  })

  it('should show loading message while script loads', () => {
    render(<GoogleRecaptcha siteKey="test-site-key" />)
    expect(screen.getByText('Loading reCAPTCHA...')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <GoogleRecaptcha siteKey="test-site-key" className="custom-recaptcha" />
    )
    expect(container.firstChild).toHaveClass('custom-recaptcha')
  })

  it('should render hidden input with name', () => {
    render(<GoogleRecaptcha siteKey="test-site-key" name="custom-name" />)
    const hiddenInput = document.querySelector('input[type="hidden"]')
    expect(hiddenInput).toHaveAttribute('name', 'custom-name')
  })

  it('should create script tag for reCAPTCHA', () => {
    render(<GoogleRecaptcha siteKey="test-site-key" />)
    const script = document.getElementById('google-recaptcha-script')
    expect(script).toBeInTheDocument()
    expect(script?.getAttribute('src')).toContain('google.com/recaptcha')
  })
})

describe('CaptchaInput (unified)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          image: 'data:image/png;base64,testimage',
          session_key: 'session-123',
        }),
    })
  })

  it('should render ImageCaptcha by default', async () => {
    render(<CaptchaInput />)

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  it('should render ImageCaptcha when type is "image"', async () => {
    render(<CaptchaInput type="image" />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('should render GoogleRecaptcha when type is "recaptcha"', () => {
    render(<CaptchaInput type="recaptcha" recaptchaProps={{ siteKey: 'test-site-key' }} />)

    // Should show loading message for recaptcha
    expect(screen.getByText('Loading reCAPTCHA...')).toBeInTheDocument()
    // Should not have the image captcha input
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should fall back to ImageCaptcha if recaptcha siteKey is missing', async () => {
    render(<CaptchaInput type="recaptcha" />)

    await waitFor(() => {
      // Should render image captcha as fallback
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('should pass imageCaptchaProps to ImageCaptcha', async () => {
    render(
      <CaptchaInput
        type="image"
        imageCaptchaProps={{
          label: 'Custom Label',
          placeholder: 'Custom Placeholder',
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Custom Placeholder')).toBeInTheDocument()
    })
  })

  it('should pass recaptchaProps to GoogleRecaptcha', () => {
    render(
      <CaptchaInput
        type="recaptcha"
        recaptchaProps={{
          siteKey: 'custom-site-key',
          theme: 'dark',
        }}
      />
    )

    // Just verify it renders without error (shows loading state)
    expect(screen.getByText('Loading reCAPTCHA...')).toBeInTheDocument()
  })

  it('should apply className to wrapper', async () => {
    const { container } = render(<CaptchaInput className="custom-wrapper" />)
    expect(container.firstChild).toHaveClass('custom-wrapper')
  })
})

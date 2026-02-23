import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { AxiosError, AxiosHeaders } from 'axios'
import {
  parseApiError,
  getErrorMessage,
  isValidationError,
  getValidationErrors,
} from '@/lib/api/errors'
import { categorizeError, isRetryableError } from '@/lib/utils/error-boundary-utils'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// ---------------------------------------------------------------------------
// T306: API Error Handling Verification
// ---------------------------------------------------------------------------

// ---- parseApiError utility tests ----

describe('parseApiError', () => {
  it('parses Axios error with backend response', () => {
    const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Invalid QR code data', code: 'INVALID_INPUT' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    })

    const result = parseApiError(axiosError)
    expect(result.message).toBe('Invalid QR code data')
    expect(result.code).toBe('INVALID_INPUT')
    expect(result.statusCode).toBe(400)
  })

  it('parses network error (no response)', () => {
    const axiosError = new AxiosError('Network Error', 'ERR_NETWORK')

    const result = parseApiError(axiosError)
    expect(result.message).toBe('Network Error')
    expect(result.code).toBe('NETWORK_ERROR')
    expect(result.statusCode).toBe(0)
  })

  it('parses unknown Error instances', () => {
    const result = parseApiError(new TypeError('Cannot read properties'))
    expect(result.message).toBe('Cannot read properties')
    expect(result.code).toBe('UNKNOWN_ERROR')
  })

  it('returns generic message for non-Error values', () => {
    const result = parseApiError('something went wrong')
    expect(result.message).toBe('An unexpected error occurred')
  })
})

// ---- getErrorMessage utility ----

describe('getErrorMessage', () => {
  it('returns user-friendly message from Axios error', () => {
    const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: { message: 'Email is already in use' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    })

    expect(getErrorMessage(axiosError)).toBe('Email is already in use')
  })

  it('never exposes raw stack traces', () => {
    const error = new Error('Internal server error')
    error.stack = 'Error: Internal server error\n    at Object.<anonymous> (/app/server.js:42:11)'
    const message = getErrorMessage(error)
    expect(message).not.toContain('/app/server.js')
    expect(message).not.toContain('at Object')
  })
})

// ---- Validation error helpers ----

describe('isValidationError', () => {
  it('identifies 422 responses with field errors', () => {
    const apiError = {
      message: 'Validation failed',
      statusCode: 422,
      errors: { email: 'Email is required', name: 'Name is too short' },
    }
    expect(isValidationError(apiError)).toBe(true)
  })

  it('rejects non-422 errors', () => {
    expect(isValidationError({ message: 'Not found', statusCode: 404 })).toBe(false)
  })
})

describe('getValidationErrors', () => {
  it('extracts field error strings from 422 Axios error', () => {
    const axiosError = new AxiosError(
      'Validation failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: {
          message: 'Validation failed',
          errors: { email: 'Invalid email', password: 'Too short' },
        },
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    )

    const errors = getValidationErrors(axiosError)
    expect(errors).toContain('Invalid email')
    expect(errors).toContain('Too short')
  })
})

// ---- Error categorization ----

describe('categorizeError', () => {
  it('categorizes network errors', () => {
    expect(categorizeError(new TypeError('Failed to fetch'))).toBe('network')
    expect(categorizeError(new Error('Network request failed'))).toBe('network')
    expect(categorizeError(new Error('ECONNREFUSED'))).toBe('network')
    expect(categorizeError(new Error('Request timeout'))).toBe('network')
  })

  it('categorizes auth errors', () => {
    expect(categorizeError(new Error('Unauthorized'))).toBe('auth')
    expect(categorizeError(new Error('401 Not authenticated'))).toBe('auth')
    expect(categorizeError(new Error('403 Access denied'))).toBe('auth')
    expect(categorizeError(new Error('Token expired'))).toBe('auth')
  })

  it('categorizes validation errors', () => {
    expect(categorizeError(new Error('Validation failed'))).toBe('validation')
    expect(categorizeError(new Error('Invalid input'))).toBe('validation')
  })

  it('returns unknown for unrecognized errors', () => {
    expect(categorizeError(new Error('Something completely ordinary happened'))).toBe('unknown')
    expect(categorizeError(null)).toBe('unknown')
  })
})

describe('isRetryableError', () => {
  it('marks network errors as retryable', () => {
    expect(isRetryableError(new Error('Network error'))).toBe(true)
  })

  it('marks auth errors as retryable', () => {
    expect(isRetryableError(new Error('Unauthorized'))).toBe(true)
  })

  it('marks validation errors as non-retryable', () => {
    expect(isRetryableError(new Error('Validation failed'))).toBe(false)
  })
})

// ---- HTTP status code handling ----

describe('HTTP status code error handling', () => {
  function makeAxios(status: number, data: Record<string, unknown>) {
    return new AxiosError(
      `Request failed with status code ${status}`,
      `ERR_BAD_REQUEST`,
      undefined,
      undefined,
      {
        status,
        statusText: '',
        data,
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    )
  }

  it('handles 401 Unauthorized', () => {
    const err = makeAxios(401, { message: 'Authentication required' })
    const parsed = parseApiError(err)
    expect(parsed.statusCode).toBe(401)
    expect(parsed.message).toBe('Authentication required')
  })

  it('handles 403 Forbidden', () => {
    const err = makeAxios(403, { message: 'You do not have permission' })
    const parsed = parseApiError(err)
    expect(parsed.statusCode).toBe(403)
    expect(parsed.message).toBe('You do not have permission')
  })

  it('handles 404 Not Found', () => {
    const err = makeAxios(404, { message: 'Resource not found' })
    const parsed = parseApiError(err)
    expect(parsed.statusCode).toBe(404)
    expect(parsed.message).toBe('Resource not found')
  })

  it('handles 500 Internal Server Error with user-friendly message', () => {
    const err = makeAxios(500, { message: 'Something went wrong, please try again later' })
    const parsed = parseApiError(err)
    expect(parsed.statusCode).toBe(500)
    expect(parsed.message).not.toContain('stack')
    expect(parsed.message).toBe('Something went wrong, please try again later')
  })

  it('handles 429 Rate Limit', () => {
    const err = makeAxios(429, { message: 'Too many requests' })
    const parsed = parseApiError(err)
    expect(parsed.statusCode).toBe(429)
    expect(parsed.message).toBe('Too many requests')
  })
})

// ---- ErrorBoundary component ----

describe('ErrorBoundary component', () => {
  // Suppress React error boundary console.error noise
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  function ThrowingComponent({ error }: { error: Error }): React.JSX.Element {
    throw error
  }

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('catches rendering errors and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Component crashed')} />
      </ErrorBoundary>
    )
    // Should show an error UI instead of crashing the whole app
    expect(screen.queryByText('All good')).not.toBeInTheDocument()
    // The ErrorBoundary should render some error indication
    expect(document.body.textContent).toBeTruthy()
  })

  it('shows network error category for network failures', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new TypeError('Failed to fetch')} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Network Error')).toBeInTheDocument()
  })

  it('shows auth error category for auth failures', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Unauthorized access')} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Authentication Error')).toBeInTheDocument()
  })

  it('shows validation error category for validation failures', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Validation failed')} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Validation Error')).toBeInTheDocument()
  })
})

/**
 * Unit Tests for Error Message Mapper
 * @file tests/unit/error-message-mapper.test.ts
 */

import { describe, it, expect } from 'vitest'
import {
  getErrorMessage,
  getValidationMessage,
  processValidationErrors,
  translateMessage,
  getHttpStatusMessage,
  processApiError,
  isNetworkError,
  isTimeoutError,
  isConnectionError,
  ERROR_MESSAGES,
  FIELD_SPECIFIC_MESSAGES,
} from '@/lib/utils/error-message-mapper'

describe('getErrorMessage', () => {
  it('should return correct message for known error codes', () => {
    expect(getErrorMessage('PAYMENT_001')).toBe(
      'Please check your payment information and try again.'
    )
    expect(getErrorMessage('PAYMENT_101')).toContain('card was declined')
    expect(getErrorMessage('UNAUTHORIZED')).toBe('Please log in to continue.')
  })

  it('should be case insensitive', () => {
    expect(getErrorMessage('payment_001')).toBe(
      'Please check your payment information and try again.'
    )
    expect(getErrorMessage('Payment_001')).toBe(
      'Please check your payment information and try again.'
    )
  })

  it('should return unknown error for null/undefined', () => {
    expect(getErrorMessage(null)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
    expect(getErrorMessage(undefined)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('should return unknown error for unrecognized codes', () => {
    expect(getErrorMessage('NONEXISTENT_CODE')).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('should handle network error codes', () => {
    expect(getErrorMessage('NETWORK_ERROR')).toContain('internet connection')
    expect(getErrorMessage('CONNECTION_REFUSED')).toContain('Unable to connect')
  })

  it('should handle authentication error codes', () => {
    expect(getErrorMessage('SESSION_EXPIRED')).toContain('session has expired')
    expect(getErrorMessage('INVALID_CREDENTIALS')).toContain('Invalid email or password')
  })

  it('should handle rate limiting error codes', () => {
    expect(getErrorMessage('RATE_LIMIT_EXCEEDED')).toContain('Too many requests')
    expect(getErrorMessage('QUOTA_EXCEEDED')).toContain('exceeded your usage quota')
  })

  it('should handle QR code specific error codes', () => {
    expect(getErrorMessage('QRCODE_LIMIT_REACHED')).toContain('QR code limit')
    expect(getErrorMessage('QRCODE_NOT_FOUND')).toContain('not found')
  })
})

describe('getValidationMessage', () => {
  it('should return field-specific messages when available', () => {
    expect(getValidationMessage('email', 'required')).toBe('Email address is required.')
    expect(getValidationMessage('password', 'min')).toBe(
      'Password must be at least 8 characters long.'
    )
  })

  it('should fall back to generic messages', () => {
    expect(getValidationMessage('username', 'required')).toBe('Username is required.')
    expect(getValidationMessage('phone', 'numeric')).toBe('Phone must be a number.')
  })

  it('should use original message as fallback', () => {
    const original = 'Custom validation message'
    expect(getValidationMessage('field', 'custom', original)).toBe(original)
  })

  it('should handle different field types', () => {
    expect(getValidationMessage('url', 'url')).toContain('valid URL')
    expect(getValidationMessage('name', 'max')).toContain('too long')
  })
})

describe('processValidationErrors', () => {
  it('should process validation errors object', () => {
    const errors = {
      email: 'The email field is required.',
      password: ['The password must be at least 8 characters.'],
    }
    const result = processValidationErrors(errors)
    expect(result).toContain('Email address is required')
    expect(result).toContain('Password')
  })

  it('should handle array of messages per field', () => {
    const errors = {
      password: ['Password is required.', 'Password must include numbers.'],
    }
    const result = processValidationErrors(errors)
    expect(result).toBeTruthy()
  })

  it('should return default message for null/undefined', () => {
    expect(processValidationErrors(null)).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
    expect(processValidationErrors(undefined)).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
  })

  it('should return default message for non-object', () => {
    expect(processValidationErrors('string' as unknown as Record<string, string>)).toBe(
      ERROR_MESSAGES.VALIDATION_ERROR
    )
  })
})

describe('translateMessage', () => {
  it('should translate known error patterns', () => {
    expect(translateMessage('Validation failed')).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
    expect(translateMessage('Unauthorized access')).toBe(ERROR_MESSAGES.UNAUTHORIZED)
    expect(translateMessage('Network error occurred')).toBe(ERROR_MESSAGES.NETWORK_ERROR)
  })

  it('should be case insensitive', () => {
    expect(translateMessage('VALIDATION FAILED')).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
    expect(translateMessage('network ERROR')).toBe(ERROR_MESSAGES.NETWORK_ERROR)
  })

  it('should handle timeout patterns', () => {
    // 'timeout' pattern matches first in the patterns object
    expect(translateMessage('Connection timeout')).toBe(ERROR_MESSAGES.TIMEOUT_ERROR)
    // 'signal is aborted' matches 'abort' pattern
    expect(translateMessage('Signal is aborted')).toBe(ERROR_MESSAGES.CONNECTION_TIMEOUT)
  })

  it('should handle payment patterns', () => {
    expect(translateMessage('Card declined')).toContain('declined')
    expect(translateMessage('Insufficient funds')).toContain('funds')
  })

  it('should return unknown error for null/undefined', () => {
    expect(translateMessage(null)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
    expect(translateMessage(undefined)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('should return original message if no pattern matches', () => {
    const msg = 'Some custom server message'
    expect(translateMessage(msg)).toBe(msg)
  })
})

describe('getHttpStatusMessage', () => {
  it('should return appropriate messages for status codes', () => {
    expect(getHttpStatusMessage(400)).toBe(ERROR_MESSAGES.BAD_REQUEST)
    expect(getHttpStatusMessage(401)).toBe(ERROR_MESSAGES.UNAUTHORIZED)
    expect(getHttpStatusMessage(403)).toBe(ERROR_MESSAGES.FORBIDDEN)
    expect(getHttpStatusMessage(404)).toBe(ERROR_MESSAGES.NOT_FOUND)
    expect(getHttpStatusMessage(422)).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
    expect(getHttpStatusMessage(500)).toBe(ERROR_MESSAGES.SERVER_ERROR)
  })

  it('should return unknown error for unhandled status codes', () => {
    expect(getHttpStatusMessage(418)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('should handle rate limiting', () => {
    expect(getHttpStatusMessage(429)).toContain('Too many requests')
  })

  it('should handle gateway errors', () => {
    expect(getHttpStatusMessage(502)).toContain('unavailable')
    expect(getHttpStatusMessage(503)).toContain('unavailable')
    expect(getHttpStatusMessage(504)).toBe(ERROR_MESSAGES.TIMEOUT_ERROR)
  })
})

describe('processApiError', () => {
  it('should process validation errors', () => {
    const error = {
      validationErrors: {
        email: 'Email is required.',
      },
    }
    expect(processApiError(error)).toContain('Email')
  })

  it('should process error_code', () => {
    const error = { error_code: 'PAYMENT_001' }
    expect(processApiError(error)).toBe('Please check your payment information and try again.')
  })

  it('should process code field', () => {
    const error = { code: 'UNAUTHORIZED' }
    expect(processApiError(error)).toBe('Please log in to continue.')
  })

  it('should process message field', () => {
    const error = { message: 'Network error' }
    expect(processApiError(error)).toContain('internet connection')
  })

  it('should process status field', () => {
    const error = { status: 404 }
    expect(processApiError(error)).toBe(ERROR_MESSAGES.NOT_FOUND)
  })

  it('should return unknown error for empty error object', () => {
    expect(processApiError({})).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
  })

  it('should prioritize validation errors over other fields', () => {
    const error = {
      validationErrors: { email: 'Required' },
      error_code: 'PAYMENT_001',
      message: 'Some message',
    }
    expect(processApiError(error)).toContain('Email')
  })
})

describe('isNetworkError', () => {
  it('should detect NetworkError by name', () => {
    const error = new Error('Failed')
    error.name = 'NetworkError'
    expect(isNetworkError(error)).toBe(true)
  })

  it('should detect network error by message', () => {
    expect(isNetworkError(new Error('Network request failed'))).toBe(true)
    expect(isNetworkError(new Error('Fetch failed'))).toBe(true)
  })

  it('should return false for non-network errors', () => {
    expect(isNetworkError(new Error('Validation failed'))).toBe(false)
    expect(isNetworkError(new Error('Some other error'))).toBe(false)
  })
})

describe('isTimeoutError', () => {
  it('should detect TimeoutError by name', () => {
    const error = new Error('Timed out')
    error.name = 'TimeoutError'
    expect(isTimeoutError(error)).toBe(true)
  })

  it('should detect AbortError by name', () => {
    const error = new Error('Aborted')
    error.name = 'AbortError'
    expect(isTimeoutError(error)).toBe(true)
  })

  it('should detect timeout by message', () => {
    expect(isTimeoutError(new Error('Request timeout'))).toBe(true)
    expect(isTimeoutError(new Error('Signal is aborted'))).toBe(true)
  })

  it('should detect timeout by code', () => {
    const error = new Error('Failed') as Error & { code: string }
    error.code = 'TIMEOUT'
    expect(isTimeoutError(error)).toBe(true)
  })

  it('should return false for non-timeout errors', () => {
    expect(isTimeoutError(new Error('Some error'))).toBe(false)
  })
})

describe('isConnectionError', () => {
  it('should detect connection errors', () => {
    expect(isConnectionError(new Error('Connection refused'))).toBe(true)
    expect(isConnectionError(new Error('Network failed'))).toBe(true)
  })

  it('should detect network and timeout errors', () => {
    const networkError = new Error('Failed')
    networkError.name = 'NetworkError'
    expect(isConnectionError(networkError)).toBe(true)

    const timeoutError = new Error('Failed')
    timeoutError.name = 'TimeoutError'
    expect(isConnectionError(timeoutError)).toBe(true)
  })

  it('should return false for non-connection errors', () => {
    expect(isConnectionError(new Error('Validation failed'))).toBe(false)
  })
})

describe('ERROR_MESSAGES constant', () => {
  it('should have validation error messages', () => {
    expect(ERROR_MESSAGES.VALIDATION_ERROR).toBeDefined()
    expect(ERROR_MESSAGES.VALIDATION_FAILED).toBeDefined()
  })

  it('should have network error messages', () => {
    expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined()
    expect(ERROR_MESSAGES.CONNECTION_TIMEOUT).toBeDefined()
    expect(ERROR_MESSAGES.OFFLINE).toBeDefined()
  })

  it('should have authentication error messages', () => {
    expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined()
    expect(ERROR_MESSAGES.SESSION_EXPIRED).toBeDefined()
    expect(ERROR_MESSAGES.INVALID_CREDENTIALS).toBeDefined()
  })

  it('should have QR code error messages', () => {
    expect(ERROR_MESSAGES.QRCODE_LIMIT_REACHED).toBeDefined()
    expect(ERROR_MESSAGES.QRCODE_NOT_FOUND).toBeDefined()
    expect(ERROR_MESSAGES.QRCODE_GENERATION_FAILED).toBeDefined()
  })
})

describe('FIELD_SPECIFIC_MESSAGES constant', () => {
  it('should have email field messages', () => {
    expect(FIELD_SPECIFIC_MESSAGES.email).toBeDefined()
    expect(FIELD_SPECIFIC_MESSAGES.email.required).toBeDefined()
    expect(FIELD_SPECIFIC_MESSAGES.email.email).toBeDefined()
  })

  it('should have password field messages', () => {
    expect(FIELD_SPECIFIC_MESSAGES.password).toBeDefined()
    expect(FIELD_SPECIFIC_MESSAGES.password.required).toBeDefined()
    expect(FIELD_SPECIFIC_MESSAGES.password.min).toBeDefined()
  })

  it('should have URL field messages', () => {
    expect(FIELD_SPECIFIC_MESSAGES.url).toBeDefined()
    expect(FIELD_SPECIFIC_MESSAGES.url.url).toBeDefined()
  })
})

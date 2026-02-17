import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  errors?: Record<string, string> // For validation errors
}

export interface ValidationError extends ApiError {
  errors: Record<string, string>
}

export class ApiException extends Error {
  public statusCode: number
  public code?: string
  public errors?: Record<string, string>

  constructor(message: string, statusCode: number, code?: string, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiException'
    this.statusCode = statusCode
    this.code = code
    this.errors = errors
  }
}

/**
 * Parse Axios error into standardized ApiError format
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const response = error.response

    // Backend returned an error response
    if (response?.data) {
      return {
        message: response.data.message || error.message,
        code: response.data.code,
        statusCode: response.status,
        errors: response.data.errors,
      }
    }

    // Network error or no response
    return {
      message: error.message || 'Network error occurred',
      code: 'NETWORK_ERROR',
      statusCode: 0,
    }
  }

  // Unknown error type
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  }
}

/**
 * Check if error is a validation error (422 status)
 */
export function isValidationError(error: ApiError): error is ValidationError {
  return error.statusCode === 422 && !!error.errors
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const apiError = parseApiError(error)
  return apiError.message
}

/**
 * Get validation errors as array of strings
 */
export function getValidationErrors(error: unknown): string[] {
  const apiError = parseApiError(error)
  if (isValidationError(apiError)) {
    return Object.values(apiError.errors)
  }
  return []
}

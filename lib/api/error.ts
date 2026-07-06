import { AxiosError } from 'axios'

/**
 * Purpose: Centralized ApiError class for frontend Axios client.
 * Owner/Author: Antigravity Agent
 * Created/Updated: July 2026
 */
export class ApiError extends Error {
  public readonly statusCode?: number
  public readonly code?: string
  public readonly errors?: Record<string, string[]>
  public readonly originalError: AxiosError

  constructor(
    message: string,
    originalError: AxiosError,
    options?: { statusCode?: number; code?: string; errors?: Record<string, string[]> }
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = options?.statusCode ?? originalError.response?.status
    this.errors = options?.errors
    this.code = options?.code
    this.originalError = originalError

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }

  /**
   * Purpose: Parses a raw AxiosError into an ApiError.
   * Owner/Author: Antigravity Agent
   * Created/Updated: July 2026
   */
  public static fromAxiosError(error: AxiosError): ApiError {
    const status = error.response?.status
    const data = error.response?.data as Record<string, any> | undefined

    let message = 'An unexpected error occurred. Please try again.'
    const code: string | undefined = data?.error_code || data?.code
    const errors: Record<string, string[]> | undefined = data?.errors

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please check your connection and try again.'
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Unable to connect to the server. Please check your internet connection.'
    } else if (status) {
      if (status === 401) {
        message = 'Your session has expired. Please log in again.'
      } else if (status === 429) {
        const retryAfter = error.response?.headers?.['retry-after']
        message = retryAfter
          ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
          : 'Too many requests. Please wait and try again.'
      } else if (status === 422 && errors) {
        const fields = Object.keys(errors)
        const firstField = fields[0]
        if (firstField !== undefined) {
          const fieldErrors = errors[firstField]
          const firstError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
          message = String(firstError) || 'Please check your input and try again.'
        } else {
          message = 'Please check your input and try again.'
        }
      } else if (data?.message) {
        message = data.message
      }
    }

    return new ApiError(message, error, { statusCode: status, code, errors })
  }
}

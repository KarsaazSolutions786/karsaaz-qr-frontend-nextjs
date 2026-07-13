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


export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const response = error.response

    if (response?.data) {
      return {
        message: response.data.message || error.message,
        code: response.data.code,
        statusCode: response.status,
        errors: response.data.errors,
      }
    }
    return {
      message: error.message || 'Network error occurred',
      code: 'NETWORK_ERROR',
      statusCode: 0,
    }
  }

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



export function isValidationError(error: ApiError): error is ValidationError {
  return error.statusCode === 422 && !!error.errors
}


export function getErrorMessage(error: unknown): string {
  const apiError = parseApiError(error)
  return apiError.message
}


export function getValidationErrors(error: unknown): string[] {
  const apiError = parseApiError(error)
  if (isValidationError(apiError)) {
    return Object.values(apiError.errors)
  }
  return []
}

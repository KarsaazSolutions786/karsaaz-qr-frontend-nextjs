/**
 * API Request/Response Types
 * Generated from OpenAPI contracts in specs/001-frontend-migration/contracts/
 */

// Pagination
export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface PaginationResponse {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationResponse
}

// Common API response
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

// Error response
export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string>
}

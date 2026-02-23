/**
 * Shared Laravel pagination normalization.
 *
 * The Laravel backend returns LengthAwarePaginator with flat snake_case keys:
 *   { data, current_page, last_page, per_page, total, from, to, ... }
 *
 * Our frontend components expect a nested camelCase format:
 *   { data, pagination: { currentPage, lastPage, perPage, total } }
 *
 * This module provides the normalizer and common types.
 */

/** Raw Laravel LengthAwarePaginator JSON shape */
export interface LaravelPaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

/** Normalized pagination used throughout the frontend */
export interface NormalizedPagination {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: NormalizedPagination
}

/**
 * Normalize a raw Laravel paginated response into frontend format.
 * Handles both Laravel paginator format and already-normalized format.
 */
export function normalizePagination<T>(raw: any): PaginatedResponse<T> {
  // Already normalized (has nested pagination object)
  if (raw?.pagination?.lastPage != null) {
    return raw as PaginatedResponse<T>
  }

  // Laravel format (flat snake_case)
  return {
    data: Array.isArray(raw?.data) ? raw.data : [],
    pagination: {
      total: raw?.total ?? 0,
      perPage: raw?.per_page ?? 10,
      currentPage: raw?.current_page ?? 1,
      lastPage: raw?.last_page ?? 1,
    },
  }
}

/**
 * Map frontend search params to backend format.
 * Backend uses 'keyword' for text search, not 'search'.
 */
export function mapSearchParams(params?: {
  page?: number
  search?: string
  keyword?: string
  [key: string]: any
}): Record<string, any> {
  if (!params) return {}
  const mapped: Record<string, any> = {}

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    // Map 'search' to 'keyword' for backend compatibility
    if (key === 'search') {
      mapped.keyword = value
    } else {
      mapped[key] = value
    }
  }

  return mapped
}

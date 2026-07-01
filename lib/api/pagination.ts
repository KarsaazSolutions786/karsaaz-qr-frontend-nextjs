/**
 * Shared Laravel pagination normalization.
 *
 * Supported backend shapes:
 * - Flat Laravel: { data, current_page, last_page, per_page, total }
 * - Nested meta:  { data, meta: { current_page, last_page, per_page, total } }
 * - Nested pagination (snake_case): { data, pagination: { current_page, ... } }
 * - Already normalized: { data, pagination: { currentPage, lastPage, ... } }
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

function sanitizePagination(p: NormalizedPagination): NormalizedPagination {
  const total = Math.max(0, Number(p.total) || 0)
  const perPage = Math.max(1, Number(p.perPage) || 10)
  const currentPage = Math.max(1, Number(p.currentPage) || 1)
  let lastPage = Math.max(1, Number(p.lastPage) || 1)
  if (total > 0) {
    lastPage = Math.max(lastPage, Math.ceil(total / perPage))
  }
  return { total, perPage, currentPage, lastPage }
}

function readPaginationFields(
  source: Record<string, unknown> | null | undefined
): NormalizedPagination | null {
  if (!source || typeof source !== 'object') return null

  const total = Number(source.total ?? source.total_count ?? 0)
  const perPage = Number(source.per_page ?? source.page_size ?? 10) || 10
  const currentPage = Number(source.current_page ?? source.currentPage ?? 1) || 1
  let lastPage = Number(source.last_page ?? source.lastPage ?? source.total_pages ?? 0)

  if (!lastPage || Number.isNaN(lastPage)) {
    lastPage = total > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1
  }

  return { total, perPage, currentPage, lastPage }
}

export function normalizePagination<T>(raw: any): PaginatedResponse<T> {
  if (!raw) {
    return {
      data: [],
      pagination: sanitizePagination({ total: 0, perPage: 10, currentPage: 1, lastPage: 1 }),
    }
  }

  // Already normalized camelCase
  if (raw?.pagination?.lastPage != null || raw?.pagination?.last_page != null) {
    const nested = readPaginationFields(raw.pagination)
    if (nested) {
      return {
        data: Array.isArray(raw.data) ? raw.data : [],
        pagination: sanitizePagination(nested),
      }
    }
  }

  // Nested pagination snake_case (Flutter / docs)
  const nestedPagination = readPaginationFields(raw.pagination)
  if (
    nestedPagination &&
    (raw.pagination?.current_page != null || raw.pagination?.last_page != null)
  ) {
    return {
      data: Array.isArray(raw.data) ? raw.data : [],
      pagination: sanitizePagination(nestedPagination),
    }
  }

  // meta wrapper (v1 / playground style)
  const metaPagination = readPaginationFields(raw.meta)
  if (metaPagination && (raw.meta?.current_page != null || raw.meta?.last_page != null)) {
    return {
      data: Array.isArray(raw.data) ? raw.data : [],
      pagination: sanitizePagination(metaPagination),
    }
  }

  // { success, data: { data: [], current_page, ... } }
  if (raw?.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    const inner = raw.data as Record<string, unknown>
    const innerPagination = readPaginationFields(inner)
    if (innerPagination && (inner.current_page != null || inner.last_page != null)) {
      return {
        data: Array.isArray(inner.data) ? (inner.data as T[]) : [],
        pagination: sanitizePagination(innerPagination),
      }
    }
  }

  // Flat Laravel paginator at top level
  const flatPagination = readPaginationFields(raw)
  return {
    data: Array.isArray(raw?.data) ? raw.data : [],
    pagination: sanitizePagination(
      flatPagination ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 }
    ),
  }
}

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
    if (key === 'search') {
      mapped.keyword = value
    } else {
      mapped[key] = value
    }
  }

  return mapped
}

import type { SortOption } from '@/components/qr/SortDropdown'
import type { FilterState } from '@/hooks/useFilters'
import type { ListQRCodesParams } from '@/lib/api/endpoints/qrcodes'

/**
 * Parse a SortOption string into sortBy + sortOrder for the API.
 */
export function parseSortOption(sort: SortOption): {
  sortBy: ListQRCodesParams['sortBy']
  sortOrder: ListQRCodesParams['sortOrder']
} {
  const map: Record<SortOption, { sortBy: ListQRCodesParams['sortBy']; sortOrder: 'asc' | 'desc' }> = {
    'name-asc':   { sortBy: 'name',      sortOrder: 'asc'  },
    'name-desc':  { sortBy: 'name',      sortOrder: 'desc' },
    'type-asc':   { sortBy: 'name',      sortOrder: 'asc'  }, // Backend may not support type sort — fall back to name
    'type-desc':  { sortBy: 'name',      sortOrder: 'desc' },
    'scans-desc': { sortBy: 'scans',     sortOrder: 'desc' },
    'scans-asc':  { sortBy: 'scans',     sortOrder: 'asc'  },
    'date-desc':  { sortBy: 'createdAt', sortOrder: 'desc' },
    'date-asc':   { sortBy: 'createdAt', sortOrder: 'asc'  },
  }
  return map[sort] ?? { sortBy: 'createdAt', sortOrder: 'desc' }
}

/**
 * Convert FilterState from the useFilters hook into API query params.
 * Only includes non-default values.
 */
export function buildApiFilters(filters: FilterState): Partial<ListQRCodesParams> {
  const params: Partial<ListQRCodesParams> = {}

  if (filters.type && filters.type !== 'all') {
    params.type = filters.type
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'archived') {
      // Backend uses search_archived boolean, not status=archived
      params.search_archived = true
    } else {
      params.status = filters.status as ListQRCodesParams['status']
    }
  }

  if (filters.scanCountMin != null) {
    params.scansMin = filters.scanCountMin
  }
  if (filters.scanCountMax != null) {
    params.scansMax = filters.scanCountMax
  }

  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date()
    switch (filters.dateRange) {
      case 'today': {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        params.createdFrom = start.toISOString()
        break
      }
      case 'week': {
        const start = new Date(now)
        start.setDate(now.getDate() - 7)
        params.createdFrom = start.toISOString()
        break
      }
      case 'month': {
        const start = new Date(now)
        start.setMonth(now.getMonth() - 1)
        params.createdFrom = start.toISOString()
        break
      }
      case 'year': {
        const start = new Date(now)
        start.setFullYear(now.getFullYear() - 1)
        params.createdFrom = start.toISOString()
        break
      }
      case 'custom': {
        if (filters.dateFrom) {
          params.createdFrom = filters.dateFrom.toISOString()
        }
        if (filters.dateTo) {
          params.createdTo = filters.dateTo.toISOString()
        }
        break
      }
    }
  }

  if (filters.tags && filters.tags.length > 0) {
    params.tags = filters.tags
  }

  return params
}

import { format, formatDistance, formatRelative, parseISO } from 'date-fns'

/**
 * Purpose: Format ISO date string to readable format
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatDate(
  dateString: string | undefined | null,
  formatStr: string = 'MMM dd, yyyy'
): string {
  if (!dateString) return '—'
  try {
    const date = parseISO(dateString)
    return format(date, formatStr)
  } catch {
    if (process.env.NODE_ENV === 'development') console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Purpose: Format ISO date string to date and time
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatDateTime(dateString: string | undefined | null): string {
  return formatDate(dateString, 'MMM dd, yyyy HH:mm')
}

/**
 * Purpose: Format ISO date string to relative time (e.g., "2 hours ago")
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return '—'
  try {
    const date = parseISO(dateString)
    return formatDistance(date, new Date(), { addSuffix: true })
  } catch {
    if (process.env.NODE_ENV === 'development') console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Purpose: Format ISO date string to relative format (e.g., "yesterday at 3:21 PM")
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatRelativeDate(dateString: string | undefined | null): string {
  if (!dateString) return '—'
  try {
    const date = parseISO(dateString)
    return formatRelative(date, new Date())
  } catch {
    if (process.env.NODE_ENV === 'development') console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Purpose: Format number with thousand separators
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Purpose: Format currency
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatCurrency(cents: number, currency: string = 'USD'): string {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars)
}

/**
 * Purpose: Format percentage
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Purpose: Format file size in human-readable format
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

import { format, formatDistance, formatRelative, parseISO } from 'date-fns'

/**
 * Format ISO date string to readable format
 * @param dateString ISO 8601 date string
 * @param formatStr date-fns format string (default: "MMM dd, yyyy")
 */
export function formatDate(dateString: string, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const date = parseISO(dateString)
    return format(date, formatStr)
  } catch (error) {
    console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Format ISO date string to date and time
 * @param dateString ISO 8601 date string
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'MMM dd, yyyy HH:mm')
}

/**
 * Format ISO date string to relative time (e.g., "2 hours ago")
 * @param dateString ISO 8601 date string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return formatDistance(date, new Date(), { addSuffix: true })
  } catch (error) {
    console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Format ISO date string to relative format (e.g., "yesterday at 3:21 PM")
 * @param dateString ISO 8601 date string
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return formatRelative(date, new Date())
  } catch (error) {
    console.error('Invalid date string:', dateString)
    return 'Invalid date'
  }
}

/**
 * Format number with thousand separators
 * @param value Number to format
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format currency
 * @param cents Amount in cents
 * @param currency Currency code (default: USD)
 */
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars)
}

/**
 * Format percentage
 * @param value Decimal value (e.g., 0.85 for 85%)
 * @param decimals Number of decimal places (default: 0)
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format file size in human-readable format
 * @param bytes File size in bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

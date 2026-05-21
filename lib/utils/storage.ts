/**
 * Storage Utility Functions
 * localStorage helpers for JSON serialization.
 */

/**
 * Purpose: Load JSON from localStorage
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function loadStoredJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load stored JSON:', error)
    }
    return null
  }
}

/**
 * Purpose: Store JSON in localStorage
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function storeJson<T>(data: T, key: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

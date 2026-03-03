/**
 * Storage Utility Functions
 * localStorage helpers for JSON serialization.
 */

/**
 * Load JSON from localStorage
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
 * Store JSON in localStorage
 */
export function storeJson<T>(data: T, key: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

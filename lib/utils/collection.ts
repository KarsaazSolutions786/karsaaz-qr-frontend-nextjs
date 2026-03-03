/**
 * Collection & Math Utility Functions
 * Array manipulation, random, range, and numeric helpers.
 */

/**
 * Generate random number between min and max
 */
export function random(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate array of numbers in range
 */
export function range(from: number, to?: number): number[] {
  const start = to !== undefined && to > from ? from : 0
  const length = to !== undefined && to > from ? to - from : from
  return Array.from({ length }).map((_, i) => i + start)
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const result: T[] = []
  const keys = array.map((_, i) => i)

  while (keys.length) {
    const idx = Math.floor(Math.random() * keys.length)
    result.push(array[keys.splice(idx, 1)[0]!] as T)
  }

  return result
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate unique ID
 */
export function generateUniqueID(idLength = 10): string {
  return [...Array(idLength).keys()].map(() => Math.random().toString(36).substring(2, 3)).join('')
}

/**
 * Escape RegExp special characters
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Add query string to URL
 */
export function urlWithQueryString(url: string, queryString: string): string {
  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
}

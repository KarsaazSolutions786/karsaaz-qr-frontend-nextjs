/**
 * Type Check & Value Check Utility Functions
 * isEmpty, type guards, and value parsing helpers.
 */

/**
 * Purpose: Check if a value is empty
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function isEmpty(subject: unknown): boolean {
  if (subject instanceof File) {
    return false
  }

  if (subject === null || subject === undefined) {
    return true
  }

  if (typeof subject === 'string') {
    return subject.trim().length === 0
  }

  if (typeof HTMLElement !== 'undefined' && subject instanceof HTMLElement) {
    return false
  }

  if (Array.isArray(subject)) {
    return subject.length === 0
  }

  if (typeof subject === 'object') {
    return Object.keys(subject).every(key => isEmpty((subject as Record<string, unknown>)[key]))
  }

  if (typeof subject === 'number') {
    return false
  }

  return false
}

/**
 * Purpose: Checks if notempty.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export const isNotEmpty = <T>(v: T | null | undefined): v is T => !isEmpty(v)

/**
 * Purpose: Check if value is null or undefined
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function nullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Purpose: Check if value is a function
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function isFunction(param: unknown): param is (...args: unknown[]) => unknown {
  return typeof param === 'function'
}

/**
 * Purpose: Check if value is primitive
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function isPrimitive(val: unknown): boolean {
  return val !== Object(val)
}

/**
 * Purpose: Check if value is an array
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Purpose: Parse boolean value from various types
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function parseBooleanValue(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    if (isNaN(+value)) return value === 'true'
    return +value !== 0
  }
  return false
}

/**
 * Purpose: Parse number value with default
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function parseNumberValue(value: unknown, defaultValue = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && !isNaN(+value)) return +value
  return defaultValue
}

/**
 * Purpose: Validate email address
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function isEmail(value: string): boolean {
  return !!String(value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

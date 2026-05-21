/**
 * Object Utility Functions
 * Deep clone, deep merge, equality checks, and object manipulation.
 */

import { isEmpty } from './checks'

/**
 * Purpose: Deep equality check using JSON serialization
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function equals<T>(obj: T, another: T): boolean {
  return JSON.stringify(obj) === JSON.stringify(another)
}

/**
 * Purpose: Pick only specified keys from object
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function only<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (result, key) => {
      result[key] = obj[key]
      return result
    },
    {} as Pick<T, K>
  )
}

/**
 * Purpose: Remove empty fields from object
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function removeEmptyFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.keys(obj).reduce((result, key) => {
    if (!isEmpty(obj[key])) {
      ;(result as Record<string, unknown>)[key] = obj[key]
    }
    return result
  }, {} as Partial<T>)
}

/**
 * Purpose: Deep clone an object
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        ;(clonedObj as Record<string, unknown>)[key] = deepClone(
          (obj as Record<string, unknown>)[key]
        )
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Purpose: Deep merge objects
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (source && typeof source === 'object' && typeof target === 'object') {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }
  }

  return deepMerge(target, ...sources)
}

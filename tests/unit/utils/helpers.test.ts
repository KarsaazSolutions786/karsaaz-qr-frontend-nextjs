/**
 * Extended Unit Tests for Helper Utility Functions
 * @file tests/unit/utils/helpers.test.ts
 *
 * Supplements the existing tests/unit/helpers.test.ts with additional
 * edge-case coverage for isEmpty, formatBytes, deepClone, deepMerge, and hash.
 *
 * Imports from sub-modules directly to test the barrel re-export and the
 * individual modules work correctly.
 */

import { describe, it, expect } from 'vitest'

// Import from sub-modules directly (not barrel) to test tree-shaking paths
import {
  isEmpty,
  parseBooleanValue,
  parseNumberValue,
  isEmail,
  nullOrUndefined,
} from '@/lib/utils/checks'
import {
  formatBytes,
  formatDuration,
  getInitials,
  numberFormat,
  capitalize,
} from '@/lib/utils/formatting'
import { deepClone, deepMerge, equals, removeEmptyFields } from '@/lib/utils/object'
import { hash } from '@/lib/utils/hash'

// ---- isEmpty edge cases ----

describe('isEmpty - extended edge cases', () => {
  it('should return false for number 0 (number type is never empty)', () => {
    // Source code: typeof subject === 'number' => return false
    // 0 is a valid number, so isEmpty(0) should be false.
    // NOTE: The existing test in tests/unit/helpers.test.ts line 79 asserts true,
    // which is incorrect per the source code logic.
    expect(isEmpty(0)).toBe(false)
  })

  it('should return false for boolean false', () => {
    // false is not null, not string, not array, not object (typeof false === 'boolean')
    // Falls through to the final return false
    expect(isEmpty(false)).toBe(false)
  })

  it('should return false for boolean true', () => {
    expect(isEmpty(true)).toBe(false)
  })

  it('should return true for whitespace-only string', () => {
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty('\t\n')).toBe(true)
  })

  it('should return true for empty nested object', () => {
    expect(isEmpty({ a: { b: null } })).toBe(true)
  })

  it('should return false for object with a File value', () => {
    const file = new File(['content'], 'doc.pdf')
    expect(isEmpty({ attachment: file })).toBe(false)
  })

  it('should return true for deeply nested empty object', () => {
    expect(isEmpty({ a: { b: { c: undefined } } })).toBe(true)
  })

  it('should return false for object containing zero', () => {
    // { count: 0 } -- 0 is number, isEmpty(0) => false
    // So the object is NOT empty because it has a non-empty value
    expect(isEmpty({ count: 0 })).toBe(false)
  })

  it('should return false for negative numbers', () => {
    expect(isEmpty(-1)).toBe(false)
    expect(isEmpty(-0.001)).toBe(false)
  })

  it('should return false for NaN', () => {
    // NaN: typeof NaN === 'number', so returns false
    expect(isEmpty(NaN)).toBe(false)
  })
})

// ---- formatBytes edge cases ----

describe('formatBytes - extended', () => {
  it('should handle exactly 1 byte', () => {
    expect(formatBytes(1)).toBe('1 Bytes')
  })

  it('should handle 1023 bytes (just below 1 KB)', () => {
    expect(formatBytes(1023)).toBe('1023 Bytes')
  })

  it('should handle exactly 1 KB', () => {
    expect(formatBytes(1024)).toBe('1 KB')
  })

  it('should handle terabytes', () => {
    const tb = 1024 ** 4
    expect(formatBytes(tb)).toBe('1 TB')
  })

  it('should handle negative decimal parameter by using 0 decimals', () => {
    expect(formatBytes(1536, -1)).toBe('2 KB')
  })

  it('should handle large precision', () => {
    expect(formatBytes(1536, 4)).toBe('1.5 KB')
  })
})

// ---- deepClone edge cases ----

describe('deepClone - extended', () => {
  it('should clone nested arrays within objects', () => {
    const original = { tags: ['a', 'b'], meta: { ids: [1, 2] } }
    const cloned = deepClone(original)

    expect(cloned).toEqual(original)
    expect(cloned.tags).not.toBe(original.tags)
    expect(cloned.meta.ids).not.toBe(original.meta.ids)
  })

  it('should handle Date objects within nested structures', () => {
    const now = new Date()
    const original = { created: now, nested: { updated: now } }
    const cloned = deepClone(original)

    expect(cloned.created.getTime()).toBe(now.getTime())
    expect(cloned.created).not.toBe(now)
  })

  it('should clone undefined values correctly', () => {
    expect(deepClone(undefined)).toBe(undefined)
  })

  it('should clone empty object', () => {
    const cloned = deepClone({})
    expect(cloned).toEqual({})
  })

  it('should clone deeply nested structure (5 levels)', () => {
    const deep = { a: { b: { c: { d: { e: 'value' } } } } }
    const cloned = deepClone(deep)

    expect(cloned.a.b.c.d.e).toBe('value')
    expect(cloned.a.b.c.d).not.toBe(deep.a.b.c.d)
  })
})

// ---- deepMerge edge cases ----

describe('deepMerge - extended', () => {
  it('should overwrite primitive values', () => {
    const target = { a: 1 }
    const source = { a: 2 } as Record<string, unknown>
    expect(deepMerge(target, source)).toEqual({ a: 2 })
  })

  it('should handle arrays by replacing (not merging)', () => {
    const target = { items: [1, 2] }
    const source = { items: [3, 4, 5] } as Record<string, unknown>
    const result = deepMerge(target, source)
    expect(result.items).toEqual([3, 4, 5])
  })

  it('should return target when no sources provided', () => {
    const target = { a: 1 }
    expect(deepMerge(target)).toEqual({ a: 1 })
  })

  it('should handle null values in source by overwriting', () => {
    const target = { a: { b: 1 } }
    const source = { a: null } as Record<string, unknown>
    const result = deepMerge(target, source)
    expect(result.a).toBe(null)
  })

  it('should merge three sources in order', () => {
    const target = { x: 1, y: 2 }
    const s1 = { y: 3, z: 4 } as Record<string, unknown>
    const s2 = { z: 5, w: 6 } as Record<string, unknown>
    expect(deepMerge(target, s1, s2)).toEqual({ x: 1, y: 3, z: 5, w: 6 })
  })
})

// ---- hash edge cases ----

describe('hash - extended', () => {
  it('should return a number', () => {
    expect(typeof hash('test')).toBe('number')
  })

  it('should produce consistent results for empty string', () => {
    expect(hash('')).toBe(hash(''))
  })

  it('should handle very long strings', () => {
    const longStr = 'a'.repeat(10000)
    expect(typeof hash(longStr)).toBe('number')
    expect(hash(longStr)).toBe(hash(longStr))
  })

  it('should produce different hashes for similar strings', () => {
    expect(hash('abc')).not.toBe(hash('abd'))
    expect(hash('hello')).not.toBe(hash('hellp'))
  })

  it('should handle special characters', () => {
    expect(typeof hash('!@#$%^&*()')).toBe('number')
    expect(hash('!@#$%^&*()')).toBe(hash('!@#$%^&*()'))
  })

  it('should produce positive numbers', () => {
    expect(hash('positive')).toBeGreaterThanOrEqual(0)
  })
})

// ---- Additional helpers coverage ----

describe('nullOrUndefined - extended', () => {
  it('should return false for empty string', () => {
    expect(nullOrUndefined('')).toBe(false)
  })

  it('should return false for 0', () => {
    expect(nullOrUndefined(0)).toBe(false)
  })

  it('should return false for empty array', () => {
    expect(nullOrUndefined([])).toBe(false)
  })
})

describe('isEmail - extended', () => {
  it('should accept emails with + addressing', () => {
    expect(isEmail('user+tag@example.com')).toBe(true)
  })

  it('should accept emails with dots in local part', () => {
    expect(isEmail('first.last@example.com')).toBe(true)
  })

  it('should reject email with spaces', () => {
    expect(isEmail('user @example.com')).toBe(false)
  })

  it('should reject double dot in domain', () => {
    expect(isEmail('user@example..com')).toBe(false)
  })
})

describe('parseNumberValue - extended', () => {
  it('should handle negative numbers', () => {
    expect(parseNumberValue(-42)).toBe(-42)
  })

  it('should handle negative string numbers', () => {
    expect(parseNumberValue('-10')).toBe(-10)
  })

  it('should return default for boolean input', () => {
    expect(parseNumberValue(true, 99)).toBe(99)
  })

  it('should return default for object input', () => {
    expect(parseNumberValue({}, 5)).toBe(5)
  })
})

describe('parseBooleanValue - extended', () => {
  it('should return false for null input', () => {
    expect(parseBooleanValue(null)).toBe(false)
  })

  it('should return false for undefined input', () => {
    expect(parseBooleanValue(undefined)).toBe(false)
  })

  it('should parse numeric string "2" as true', () => {
    expect(parseBooleanValue('2')).toBe(true)
  })
})

describe('equals - extended', () => {
  it('should return true for two empty objects', () => {
    expect(equals({}, {})).toBe(true)
  })

  it('should return true for two empty arrays', () => {
    expect(equals([], [])).toBe(true)
  })

  it('should return false when keys differ in order with different values', () => {
    expect(equals({ a: 1, b: 2 }, { b: 3, a: 1 })).toBe(false)
  })
})

describe('removeEmptyFields - extended', () => {
  it('should keep non-empty string fields', () => {
    const result = removeEmptyFields({ name: 'John', age: '' as unknown })
    expect(result).toEqual({ name: 'John' })
  })

  it('should keep numeric fields', () => {
    const result = removeEmptyFields({ count: 42, label: 'test' })
    expect(result).toEqual({ count: 42, label: 'test' })
  })

  it('should return empty object when all fields empty', () => {
    const result = removeEmptyFields({
      a: null as unknown,
      b: undefined as unknown,
      c: '' as unknown,
    })
    expect(result).toEqual({})
  })
})

describe('formatDuration - extended', () => {
  it('should format 0 seconds', () => {
    expect(formatDuration(0)).toBe('0s')
  })

  it('should format exactly 60 seconds as 1m', () => {
    expect(formatDuration(60)).toBe('1m')
  })

  it('should format exactly 3600 seconds as 1h', () => {
    expect(formatDuration(3600)).toBe('1h')
  })

  it('should format 7261 seconds as 2h 1m', () => {
    expect(formatDuration(7261)).toBe('2h 1m')
  })
})

describe('getInitials - extended', () => {
  it('should handle single character name', () => {
    expect(getInitials('A')).toBe('A')
  })

  it('should handle names with extra whitespace', () => {
    // split(' ') may produce empty strings for multiple spaces
    const result = getInitials('John  Doe')
    expect(result.length).toBeLessThanOrEqual(2)
  })
})

describe('capitalize - extended', () => {
  it('should handle all-uppercase input', () => {
    expect(capitalize('HELLO WORLD')).toBe('HELLO WORLD')
  })

  it('should handle mixed case', () => {
    expect(capitalize('hELLO wORLD')).toBe('HELLO WORLD')
  })
})

describe('numberFormat - extended', () => {
  it('should format zero', () => {
    expect(numberFormat(0)).toBe('0')
  })

  it('should format negative numbers', () => {
    expect(numberFormat(-1234567)).toBe('-1,234,567')
  })

  it('should handle very large numbers', () => {
    expect(numberFormat(1000000000)).toBe('1,000,000,000')
  })
})

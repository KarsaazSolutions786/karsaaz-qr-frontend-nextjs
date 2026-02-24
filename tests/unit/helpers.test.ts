/**
 * Unit Tests for Helper Utility Functions
 * @file tests/unit/helpers.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  isEmpty,
  isNotEmpty,
  debounce,
  throttle,
  capitalize,
  kebabCase,
  slugify,
  studlyCase,
  titleCase,
  random,
  range,
  isFunction,
  Deferred,
  isPrimitive,
  equals,
  only,
  rgbToHex,
  hexToRgb,
  hash,
  parseBooleanValue,
  isArray,
  parseNumberValue,
  generateUniqueID,
  ucfirst,
  ucwords,
  removeEmptyFields,
  escapeRegExp,
  urlWithQueryString,
  shuffle,
  sleep,
  numberFormat,
  arrayToCsv,
  isEmail,
  escapeHtml,
  sanitizeSvg,
  deepClone,
  deepMerge,
  formatBytes,
  formatDuration,
  clamp,
  getInitials,
  truncate,
  nullOrUndefined,
} from '@/lib/utils/helpers'

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
  })

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false)
  })

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('should return true for zero', () => {
    expect(isEmpty(0)).toBe(true)
  })

  it('should return false for non-zero numbers', () => {
    expect(isEmpty(42)).toBe(false)
    expect(isEmpty(-1)).toBe(false)
  })

  it('should return true for object with all empty values', () => {
    expect(isEmpty({ a: null, b: undefined })).toBe(true)
    expect(isEmpty({ a: '', b: 0 })).toBe(true)
  })

  it('should return false for object with non-empty values', () => {
    expect(isEmpty({ a: 'hello' })).toBe(false)
  })

  it('should return false for File instance', () => {
    const file = new File([''], 'test.txt')
    expect(isEmpty(file)).toBe(false)
  })
})

describe('isNotEmpty', () => {
  it('should return true for non-empty values', () => {
    expect(isNotEmpty('hello')).toBe(true)
    expect(isNotEmpty([1, 2])).toBe(true)
  })

  it('should return false for empty values', () => {
    expect(isNotEmpty(null)).toBe(false)
    expect(isNotEmpty(undefined)).toBe(false)
    expect(isNotEmpty('')).toBe(false)
  })
})

describe('nullOrUndefined', () => {
  it('should return true for null', () => {
    expect(nullOrUndefined(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(nullOrUndefined(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(nullOrUndefined('')).toBe(false)
    expect(nullOrUndefined(0)).toBe(false)
    expect(nullOrUndefined(false)).toBe(false)
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay function execution', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should only call once for multiple rapid calls', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn('arg1', 'arg2')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should execute immediately on first call', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should throttle subsequent calls', () => {
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('hello world')).toBe('Hello World')
    expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox')
  })

  it('should handle single word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('kebabCase', () => {
  it('should convert spaces to hyphens', () => {
    expect(kebabCase('hello world')).toBe('hello-world')
  })

  it('should lowercase by default', () => {
    expect(kebabCase('Hello World')).toBe('hello-world')
  })

  it('should preserve case when forceLowerCase is false', () => {
    expect(kebabCase('Hello World', false)).toBe('Hello-World')
  })

  it('should return empty string for empty input', () => {
    expect(kebabCase('')).toBe('')
  })
})

describe('slugify', () => {
  it('should create valid slug from string', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello [World] #123')).toBe('hello-world-123')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})

describe('studlyCase', () => {
  it('should convert to StudlyCase', () => {
    expect(studlyCase('hello-world')).toBe('HelloWorld')
    expect(studlyCase('hello_world')).toBe('HelloWorld')
  })
})

describe('titleCase', () => {
  it('should convert to Title Case', () => {
    expect(titleCase('hello-world')).toBe('Hello World')
    expect(titleCase('hello_world')).toBe('Hello World')
  })

  it('should handle camelCase', () => {
    expect(titleCase('helloWorld')).toBe('Hello World')
  })
})

describe('random', () => {
  it('should generate number within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = random(1, 10)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(10)
    }
  })
})

describe('range', () => {
  it('should generate array of numbers', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('should generate range from start to end', () => {
    expect(range(2, 5)).toEqual([2, 3, 4])
  })
})

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
  })

  it('should return false for non-functions', () => {
    expect(isFunction(123)).toBe(false)
    expect(isFunction('string')).toBe(false)
    expect(isFunction(null)).toBe(false)
  })
})

describe('Deferred', () => {
  it('should create a deferred promise', () => {
    const deferred = new Deferred<string>()
    expect(deferred.promise).toBeInstanceOf(Promise)
    expect(deferred.isResolved).toBe(false)
    expect(deferred.isRejected).toBe(false)
  })

  it('should resolve correctly', async () => {
    const deferred = new Deferred<string>()
    deferred.resolve('test')
    const result = await deferred.promise
    expect(result).toBe('test')
    expect(deferred.isResolved).toBe(true)
    expect(deferred.isConsumed).toBe(true)
  })

  it('should reject correctly', async () => {
    const deferred = new Deferred<string>()
    deferred.reject(new Error('test error'))
    await expect(deferred.promise).rejects.toThrow('test error')
    expect(deferred.isRejected).toBe(true)
    expect(deferred.isConsumed).toBe(true)
  })
})

describe('isPrimitive', () => {
  it('should return true for primitives', () => {
    expect(isPrimitive(123)).toBe(true)
    expect(isPrimitive('string')).toBe(true)
    expect(isPrimitive(true)).toBe(true)
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
  })

  it('should return false for objects', () => {
    expect(isPrimitive({})).toBe(false)
    expect(isPrimitive([])).toBe(false)
    expect(isPrimitive(new Date())).toBe(false)
  })
})

describe('equals', () => {
  it('should compare objects by JSON serialization', () => {
    expect(equals({ a: 1 }, { a: 1 })).toBe(true)
    expect(equals({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('should compare arrays', () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(equals([1, 2], [1, 2, 3])).toBe(false)
  })
})

describe('only', () => {
  it('should pick specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(only(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('rgbToHex', () => {
  it('should convert RGB to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff')
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
  })
})

describe('hexToRgb', () => {
  it('should convert hex to RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('0000ff')).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('should return null for invalid hex', () => {
    expect(hexToRgb('invalid')).toBeNull()
    expect(hexToRgb('#gg0000')).toBeNull()
  })
})

describe('hash', () => {
  it('should generate consistent hash for same input', () => {
    expect(hash('test')).toBe(hash('test'))
  })

  it('should generate different hash for different input', () => {
    expect(hash('test1')).not.toBe(hash('test2'))
  })

  it('should accept optional seed', () => {
    expect(hash('test', 1)).not.toBe(hash('test', 2))
  })
})

describe('parseBooleanValue', () => {
  it('should return boolean as is', () => {
    expect(parseBooleanValue(true)).toBe(true)
    expect(parseBooleanValue(false)).toBe(false)
  })

  it('should parse number values', () => {
    expect(parseBooleanValue(1)).toBe(true)
    expect(parseBooleanValue(0)).toBe(false)
    expect(parseBooleanValue(-1)).toBe(true)
  })

  it('should parse string values', () => {
    expect(parseBooleanValue('true')).toBe(true)
    expect(parseBooleanValue('false')).toBe(false)
    expect(parseBooleanValue('1')).toBe(true)
    expect(parseBooleanValue('0')).toBe(false)
  })
})

describe('isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
  })

  it('should return false for non-arrays', () => {
    expect(isArray({})).toBe(false)
    expect(isArray('string')).toBe(false)
    expect(isArray(null)).toBe(false)
  })
})

describe('parseNumberValue', () => {
  it('should return number as is', () => {
    expect(parseNumberValue(42)).toBe(42)
  })

  it('should parse numeric strings', () => {
    expect(parseNumberValue('42')).toBe(42)
    expect(parseNumberValue('3.14')).toBe(3.14)
  })

  it('should return default for non-numeric values', () => {
    expect(parseNumberValue('invalid')).toBe(0)
    expect(parseNumberValue(null, 10)).toBe(10)
  })
})

describe('generateUniqueID', () => {
  it('should generate ID of specified length', () => {
    expect(generateUniqueID(10)).toHaveLength(10)
    expect(generateUniqueID(5)).toHaveLength(5)
  })

  it('should generate unique IDs', () => {
    const id1 = generateUniqueID()
    const id2 = generateUniqueID()
    expect(id1).not.toBe(id2)
  })
})

describe('ucfirst', () => {
  it('should uppercase first character', () => {
    expect(ucfirst('hello')).toBe('Hello')
    expect(ucfirst('world')).toBe('World')
  })
})

describe('ucwords', () => {
  it('should uppercase first character of each word', () => {
    expect(ucwords('hello world')).toBe('Hello World')
  })
})

describe('removeEmptyFields', () => {
  it('should remove empty fields from object', () => {
    const obj = { a: 'value', b: '', c: null, d: undefined, e: 0 }
    expect(removeEmptyFields(obj)).toEqual({ a: 'value' })
  })
})

describe('escapeRegExp', () => {
  it('should escape special regex characters', () => {
    expect(escapeRegExp('hello.*world')).toBe('hello\\.\\*world')
    expect(escapeRegExp('[test]')).toBe('\\[test\\]')
  })
})

describe('urlWithQueryString', () => {
  it('should add query string with ?', () => {
    expect(urlWithQueryString('https://example.com', 'foo=bar')).toBe('https://example.com?foo=bar')
  })

  it('should add query string with & if URL already has query', () => {
    expect(urlWithQueryString('https://example.com?a=1', 'b=2')).toBe('https://example.com?a=1&b=2')
  })
})

describe('shuffle', () => {
  it('should return array with same elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr)
    expect(shuffled.sort()).toEqual(arr.sort())
  })

  it('should not modify original array', () => {
    const arr = [1, 2, 3]
    shuffle(arr)
    expect(arr).toEqual([1, 2, 3])
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay for specified milliseconds', async () => {
    const promise = sleep(1000)
    vi.advanceTimersByTime(1000)
    await expect(promise).resolves.toBeUndefined()
  })
})

describe('numberFormat', () => {
  it('should format number with thousands separator', () => {
    expect(numberFormat(1234567)).toBe('1,234,567')
  })

  it('should handle decimal places', () => {
    expect(numberFormat(1234.56, 2)).toBe('1,234.56')
  })

  it('should use custom separators', () => {
    expect(numberFormat(1234.56, 2, ',', '.')).toBe('1.234,56')
  })

  it('should throw for invalid input', () => {
    expect(() => numberFormat(NaN)).toThrow()
    expect(() => numberFormat(Infinity)).toThrow()
  })
})

describe('arrayToCsv', () => {
  it('should convert 2D array to CSV', () => {
    const data = [
      ['name', 'age'],
      ['John', '30'],
    ]
    expect(arrayToCsv(data)).toBe('"name","age"\r\n"John","30"')
  })

  it('should escape quotes', () => {
    const data = [['say "hello"']]
    expect(arrayToCsv(data)).toBe('"say ""hello"""')
  })
})

describe('isEmail', () => {
  it('should validate correct emails', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('user.name@domain.org')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(isEmail('invalid')).toBe(false)
    expect(isEmail('missing@domain')).toBe(false)
    expect(isEmail('@nodomain.com')).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    // In jsdom, it uses textContent which escapes < > & properly
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('should handle quotes in browser context', () => {
    // In browser/jsdom context, quotes aren't escaped by textContent
    const result = escapeHtml('"test"')
    expect(result).toContain('test')
  })

  it('should return empty string for non-string input', () => {
    expect(escapeHtml(123 as unknown as string)).toBe('')
    expect(escapeHtml(null as unknown as string)).toBe('')
  })
})

describe('sanitizeSvg', () => {
  it('should remove script tags', () => {
    const svg = '<svg><script>alert("xss")</script></svg>'
    expect(sanitizeSvg(svg)).toBe('<svg></svg>')
  })

  it('should remove event handlers', () => {
    const svg = '<svg onclick="alert(1)"></svg>'
    expect(sanitizeSvg(svg)).not.toContain('onclick')
  })

  it('should remove javascript URIs', () => {
    const svg = '<svg><a href="javascript:alert(1)"></a></svg>'
    expect(sanitizeSvg(svg)).not.toContain('javascript:')
  })

  it('should return empty string for non-string input', () => {
    expect(sanitizeSvg(null as unknown as string)).toBe('')
  })
})

describe('deepClone', () => {
  it('should clone objects deeply', () => {
    const obj = { a: { b: { c: 1 } } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.a).not.toBe(obj.a)
  })

  it('should clone arrays', () => {
    const arr = [1, [2, 3], { a: 4 }]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  it('should clone dates', () => {
    const date = new Date()
    const cloned = deepClone(date)
    expect(cloned).toEqual(date)
    expect(cloned).not.toBe(date)
  })

  it('should return primitives as is', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('string')).toBe('string')
    expect(deepClone(null)).toBe(null)
  })
})

describe('deepMerge', () => {
  it('should merge objects deeply', () => {
    const target = { a: 1, b: { c: 2 } }
    const source = { b: { d: 3 }, e: 4 }
    expect(deepMerge(target, source)).toEqual({
      a: 1,
      b: { c: 2, d: 3 },
      e: 4,
    })
  })

  it('should handle multiple sources', () => {
    const target = { a: 1 }
    const source1 = { b: 2 }
    const source2 = { c: 3 }
    expect(deepMerge(target, source1, source2)).toEqual({ a: 1, b: 2, c: 3 })
  })
})

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('should handle decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB')
  })
})

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(30)).toBe('30s')
  })

  it('should format minutes', () => {
    expect(formatDuration(90)).toBe('1m 30s')
    expect(formatDuration(120)).toBe('2m')
  })

  it('should format hours', () => {
    expect(formatDuration(3660)).toBe('1h 1m')
    expect(formatDuration(3600)).toBe('1h')
  })
})

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe('getInitials', () => {
  it('should get initials from name', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('Jane')).toBe('J')
  })

  it('should respect maxLength', () => {
    expect(getInitials('John Doe Smith', 3)).toBe('JDS')
    expect(getInitials('John Doe Smith', 2)).toBe('JD')
  })

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('')
  })
})

describe('truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...')
  })

  it('should not truncate short strings', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('should use custom ending', () => {
    expect(truncate('Hello World', 8, '…')).toBe('Hello W…')
  })
})

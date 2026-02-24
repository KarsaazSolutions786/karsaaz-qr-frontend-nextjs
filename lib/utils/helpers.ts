/**
 * Common Helper Functions
 * TypeScript utilities ported from Project 1
 */

/**
 * Check if a value is empty
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

  if (subject instanceof HTMLElement) {
    return false
  }

  if (Array.isArray(subject)) {
    return subject.length === 0
  }

  if (typeof subject === 'object') {
    return Object.keys(subject).every(key => isEmpty((subject as Record<string, unknown>)[key]))
  }

  if (typeof subject === 'number') {
    return subject === 0
  }

  return false
}

export const isNotEmpty = <T>(v: T | null | undefined): v is T => !isEmpty(v)

/**
 * Check if running on mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 900
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  cb: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, ms)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  cb: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      cb(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, ms)
    }
  }
}

/**
 * Get query parameter from URL
 */
export function queryParam(name: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

/**
 * Load JSON from localStorage
 */
export function loadStoredJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
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

/**
 * Check if value is null or undefined
 */
export function nullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, m => m.toUpperCase())
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string, forceLowerCase = true): string {
  if (isEmpty(str)) return ''
  if (forceLowerCase) str = str.toLowerCase()
  return str.replace(/ /g, '-')
}

/**
 * Convert string to slug
 */
export function slugify(str: string): string {
  if (isEmpty(str)) return ''
  str = str.replace(/[[\]{}#~/.|<>,&"'?`\-=+]/g, ' ')
  str = str.replace(/\s+/g, ' ')
  return kebabCase(str)
}

/**
 * Convert string to StudlyCase/PascalCase
 */
export function studlyCase(str: string): string {
  return titleCase(str).replace(/ /g, '')
}

/**
 * Convert string to Title Case
 */
export function titleCase(str: string): string {
  return capitalize(
    str
      .replace(/-|_/g, ' ')
      .replace(/[A-Z]/g, m => ' ' + m)
      .toLowerCase()
  )
}

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
 * Check if value is a function
 */
export function isFunction(param: unknown): param is (...args: unknown[]) => unknown {
  return typeof param === 'function'
}

/**
 * Deferred promise pattern
 */
export class Deferred<T> {
  promise: Promise<T>
  resolve!: (value: T | PromiseLike<T>) => void
  reject!: (reason?: unknown) => void
  isResolved = false
  isRejected = false
  isConsumed = false

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reason => {
        this.isRejected = true
        this.isConsumed = true
        reject(reason)
      }
      this.resolve = value => {
        this.isResolved = true
        this.isConsumed = true
        resolve(value)
      }
    })
  }
}

/**
 * Check if value is primitive
 */
export function isPrimitive(val: unknown): boolean {
  return val !== Object(val)
}

/**
 * Deep equality check using JSON serialization
 */
export function equals<T>(obj: T, another: T): boolean {
  return JSON.stringify(obj) === JSON.stringify(another)
}

/**
 * Pick only specified keys from object
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
 * Convert RGB to hex color
 */
export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const rgb = (r << 16) | (g << 8) | (b << 0)
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null
}

/**
 * Convert pixels to rem
 */
export function pxToRem(px: number): number {
  if (typeof document === 'undefined') return px / 16
  return px / parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
 * Convert rem to pixels
 */
export function remToPx(rem: number): number {
  if (typeof document === 'undefined') return rem * 16
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
 * Generate hash from string
 */
export function hash(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

/**
 * Check if running on iPhone Safari
 */
export function iPhoneSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!navigator.userAgent.match('iPhone OS')
}

/**
 * Parse boolean value from various types
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
 * Check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Parse number value with default
 */
export function parseNumberValue(value: unknown, defaultValue = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && !isNaN(+value)) return +value
  return defaultValue
}

/**
 * Generate unique ID
 */
export function generateUniqueID(idLength = 10): string {
  return [...Array(idLength).keys()].map(() => Math.random().toString(36).substring(2, 3)).join('')
}

/**
 * Uppercase first character
 */
export function ucfirst(str: string): string {
  return (str[0] ?? '').toUpperCase() + str.substring(1)
}

/**
 * Uppercase first character of each word
 */
export function ucwords(str: string): string {
  return str.split(' ').map(ucfirst).join(' ')
}

/**
 * Get scrollbar width
 */
export function getScrollbarWidth(): number {
  if (typeof document === 'undefined') return 0

  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

/**
 * Remove empty fields from object
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
 * Escape RegExp special characters
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Download content as blob
 */
export function downloadBlob(content: BlobPart, filename: string, contentType: string): void {
  if (typeof document === 'undefined') return

  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Add query string to URL
 */
export function urlWithQueryString(url: string, queryString: string): string {
  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
}

/**
 * Open link in new tab
 */
export function openLinkInNewTab(link: string): void {
  if (typeof document === 'undefined') return

  const a = document.createElement('a')
  a.href = link
  a.target = '_blank'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()

  setTimeout(() => a.remove(), 100)
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
 * Sleep/delay for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Format number with separators
 */
export function numberFormat(
  number: number,
  decimals?: number,
  decimalSeparator = '.',
  thousandsSeparator = ','
): string {
  if (number == null || !isFinite(number)) {
    throw new TypeError('number is not valid')
  }

  if (!decimals) {
    const numberAfterDecimalPoint = number.toString().split('.')[1]
    if (numberAfterDecimalPoint && parseInt(numberAfterDecimalPoint)) {
      decimals = numberAfterDecimalPoint.length
    }
  }

  let formatted = parseFloat(String(number)).toFixed(decimals)
  formatted = formatted.replace('.', decimalSeparator)

  const splitNum = formatted.split(decimalSeparator)
  splitNum[0] = splitNum[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  return splitNum.join(decimalSeparator)
}

/**
 * Convert 2D array to CSV string
 */
export function arrayToCsv(data: string[][]): string {
  return data
    .map(row =>
      row
        .map(String)
        .map(v => v.replaceAll('"', '""'))
        .map(v => `"${v}"`)
        .join(',')
    )
    .join('\r\n')
}

/**
 * Validate email address
 */
export function isEmail(value: string): boolean {
  return !!String(value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return ''
  if (typeof document === 'undefined') {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

/**
 * Sanitize SVG content
 */
export function sanitizeSvg(svg: string): string {
  if (typeof svg !== 'string') return ''
  let sanitized = svg
  // Remove script tags
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '')
  // Remove event handlers
  sanitized = sanitized.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\bon\w+\s*=\s*[^\s>]+/gi, '')
  // Remove javascript: URIs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
  sanitized = sanitized.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '')
  return sanitized
}

/**
 * Deep clone an object
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
 * Deep merge objects
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

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Get initials from name
 */
export function getInitials(name: string, maxLength = 2): string {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join('')
    .toUpperCase()
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, ending = '...'): string {
  if (str.length <= length) return str
  return str.substring(0, length - ending.length) + ending
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    if (typeof document === 'undefined') return false
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      textarea.remove()
    }
  }
}

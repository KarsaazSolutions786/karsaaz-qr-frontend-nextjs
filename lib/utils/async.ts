/**
 * Async & Timing Utility Functions
 * Debounce, throttle, sleep, and deferred promise.
 */

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
 * Sleep/delay for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
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

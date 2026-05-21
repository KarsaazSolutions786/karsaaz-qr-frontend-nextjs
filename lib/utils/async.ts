/**
 * Async & Timing Utility Functions
 * Debounce, throttle, sleep, and deferred promise.
 */

/**
 * Purpose: Debounce function calls
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
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
 * Purpose: Throttle function calls
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
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
 * Purpose: Sleep/delay for specified milliseconds
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Purpose: Deferred promise pattern
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export class Deferred<T> {
  promise: Promise<T>
  resolve!: (value: T | PromiseLike<T>) => void
  reject!: (reason?: unknown) => void
  isResolved = false
  isRejected = false
  isConsumed = false

  /**
   * Purpose: Constructor for constructor.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
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

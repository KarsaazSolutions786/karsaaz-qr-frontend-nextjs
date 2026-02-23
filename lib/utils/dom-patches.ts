/**
 * Browser compatibility checks and polyfill stubs.
 */

export function supportsIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}

export function supportsResizeObserver(): boolean {
  return typeof window !== 'undefined' && 'ResizeObserver' in window
}

export function applyPatches(): void {
  if (typeof window === 'undefined') return

  if (!supportsIntersectionObserver()) {
    // Minimal stub so code referencing IntersectionObserver won't throw
    ;(window as unknown as Record<string, unknown>).IntersectionObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  }

  if (!supportsResizeObserver()) {
    ;(window as unknown as Record<string, unknown>).ResizeObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  }
}

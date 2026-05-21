/**
 * Purpose: Browser compatibility checks and polyfill stubs.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */


export function supportsIntersectionObserver(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}

/**
 * Purpose: Executes supportsResizeObserver functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function supportsResizeObserver(): boolean {
  return typeof window !== 'undefined' && 'ResizeObserver' in window
}

/**
 * Purpose: Executes applyPatches functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function applyPatches(): void {
  if (typeof window === 'undefined') return

  if (!supportsIntersectionObserver()) {
    // Minimal stub so code referencing IntersectionObserver won't throw
    ;(window as unknown as Record<string, unknown>).IntersectionObserver = class {
      /**
       * Purpose: Executes observe functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      observe(): void {}
      /**
       * Purpose: Executes unobserve functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      unobserve(): void {}
      /**
       * Purpose: Executes disconnect functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      disconnect(): void {}
    }
  }

  if (!supportsResizeObserver()) {
    ;(window as unknown as Record<string, unknown>).ResizeObserver = class {
      /**
       * Purpose: Executes observe functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      observe(): void {}
      /**
       * Purpose: Executes unobserve functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      unobserve(): void {}
      /**
       * Purpose: Executes disconnect functionality.
       * Owner/Author: Syed Ashhad
       * Created/Updated: February 2026
       */
      disconnect(): void {}
    }
  }
}

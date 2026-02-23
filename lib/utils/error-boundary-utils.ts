/**
 * Error Boundary Utilities
 *
 * Categorization, retry helpers, and global error handlers
 * for the Phase 14 enhanced error boundary system.
 */

export type ErrorCategory = 'network' | 'auth' | 'validation' | 'unknown'

/** Categorize an error into a known bucket */
export function categorizeError(error: unknown): ErrorCategory {
  if (!error) return 'unknown'

  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  const name = error instanceof Error ? error.name.toLowerCase() : ''

  // Network errors
  if (
    (name === 'typeerror' && message.includes('fetch')) ||
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('net::') ||
    message.includes('econnrefused') ||
    message.includes('timeout') ||
    message.includes('aborted')
  ) {
    return 'network'
  }

  // Auth errors
  if (
    message.includes('unauthorized') ||
    message.includes('403') ||
    message.includes('401') ||
    message.includes('authentication') ||
    message.includes('token expired') ||
    message.includes('not authenticated') ||
    message.includes('access denied')
  ) {
    return 'auth'
  }

  // Validation errors
  if (
    name === 'validationerror' ||
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required field') ||
    message.includes('must be') ||
    message.includes('expected')
  ) {
    return 'validation'
  }

  return 'unknown'
}

/** Determine whether the error is worth retrying */
export function isRetryableError(error: unknown): boolean {
  const category = categorizeError(error)
  // Network errors are typically transient and retryable
  if (category === 'network') return true
  // Auth errors may resolve after re-auth, allow retry
  if (category === 'auth') return true
  // Validation / unknown are usually deterministic
  return false
}

/**
 * Install global handlers for uncaught errors and unhandled rejections.
 * Call once at app startup (e.g., in a root layout or entry point).
 */
export function setupGlobalErrorHandlers(
  onError?: (category: ErrorCategory, error: unknown) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleError = (event: ErrorEvent) => {
    const category = categorizeError(event.error ?? event.message)
    console.error(
      `[GlobalErrorHandler] category=${category}`,
      event.message,
      event.filename ? `at ${event.filename}:${event.lineno}:${event.colno}` : ''
    )
    onError?.(category, event.error ?? event.message)
  }

  const handleRejection = (event: PromiseRejectionEvent) => {
    const category = categorizeError(event.reason)
    console.error(`[GlobalErrorHandler:unhandledrejection] category=${category}`, event.reason)
    onError?.(category, event.reason)
  }

  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleRejection)

  // Return cleanup function
  return () => {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleRejection)
  }
}

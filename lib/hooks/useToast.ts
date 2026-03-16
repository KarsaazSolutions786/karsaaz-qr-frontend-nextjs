'use client'

import { useCallback } from 'react'
import { toast as sonnerToast } from 'sonner'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const DEFAULT_DURATION = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  default: 3000,
}

/**
 * useToast hook - provides a consistent toast API wrapping sonner
 * Compatible with the toast patterns from Project 1
 */
export function useToast() {
  const toast = useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION.default,
      action: options?.action,
    })
  }, [])

  const success = useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION.success,
      action: options?.action,
    })
  }, [])

  const error = useCallback((message: string | Error, options?: ToastOptions) => {
    const msg = message instanceof Error ? message.message : message
    return sonnerToast.error(msg, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION.error,
      action: options?.action,
    })
  }, [])

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION.warning,
      action: options?.action,
    })
  }, [])

  const info = useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION.info,
      action: options?.action,
    })
  }, [])

  const loading = useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    })
  }, [])

  const promise = useCallback(
    <T>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: Error) => string)
      }
    ) => {
      return sonnerToast.promise(promise, messages)
    },
    []
  )

  const dismiss = useCallback((id?: string | number) => {
    sonnerToast.dismiss(id)
  }, [])

  const clearAll = useCallback(() => {
    sonnerToast.dismiss()
  }, [])

  // API Error handler - compatible with Project 1's showApiError
  const showApiError = useCallback(
    (apiError: { message?: string; response?: { status?: number } }) => {
      // Handle 401 Unauthorized
      if (apiError.response?.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:invalid-token'))
      }

      const message = apiError.message || 'An unexpected error occurred'
      return sonnerToast.error(message, {
        duration: DEFAULT_DURATION.error,
      })
    },
    []
  )

  // Validation error handler - compatible with Project 1's showValidationError
  const showValidationError = useCallback(
    (validationError: { message?: string; errors?: Record<string, string[]> }) => {
      let message = validationError.message || 'Validation failed'

      // If there are field errors, show the first one
      if (validationError.errors) {
        const firstError = Object.values(validationError.errors)[0]
        if (firstError && firstError.length > 0) {
          message = firstError[0] ?? message
        }
      }

      return sonnerToast.error(message, {
        duration: DEFAULT_DURATION.error,
      })
    },
    []
  )

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    clearAll,
    showApiError,
    showValidationError,
  }
}

// Static methods for use outside of components (like in API clients)
export const showToast = (message: string) => sonnerToast(message)
export const showSuccessToast = (message: string) => sonnerToast.success(message)
export const showErrorToast = (message: string | Error) => {
  const msg = message instanceof Error ? message.message : message
  return sonnerToast.error(msg, { duration: DEFAULT_DURATION.error })
}
export const showWarningToast = (message: string) => sonnerToast.warning(message)
export const showInfoToast = (message: string) => sonnerToast.info(message)

export default useToast

/**
 * Error Boundary
 *
 * React error boundary for graceful error handling.
 */

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Wifi, ShieldAlert, FileWarning } from 'lucide-react'
import {
  categorizeError,
  isRetryableError,
  type ErrorCategory,
} from '@/lib/utils/error-boundary-utils'

/** Per-category UI metadata */
function getCategoryMeta(category: ErrorCategory) {
  switch (category) {
    case 'network':
      return {
        icon: <Wifi className="w-8 h-8 text-orange-600" />,
        bgColor: 'bg-orange-100',
        title: 'Network Error',
        description: 'Unable to reach the server. Please check your connection and try again.',
      }
    case 'auth':
      return {
        icon: <ShieldAlert className="w-8 h-8 text-yellow-600" />,
        bgColor: 'bg-yellow-100',
        title: 'Authentication Error',
        description: 'Your session may have expired. Please sign in again.',
      }
    case 'validation':
      return {
        icon: <FileWarning className="w-8 h-8 text-blue-600" />,
        bgColor: 'bg-blue-100',
        title: 'Validation Error',
        description: 'The data provided was invalid. Please review your input.',
      }
    default:
      return {
        icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
        bgColor: 'bg-red-100',
        title: 'Oops! Something went wrong',
        description:
          "We're sorry for the inconvenience. The application encountered an unexpected error.",
      }
  }
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCategory: ErrorCategory
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCategory: 'unknown',
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCategory: categorizeError(error),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const category = categorizeError(error)
    const retryable = isRetryableError(error)

    console.error(
      `[ErrorBoundary] category=${category} retryable=${retryable} retryCount=${this.state.retryCount}`,
      { error, componentStack: errorInfo.componentStack }
    )

    this.setState({
      error,
      errorInfo,
      errorCategory: category,
    })

    this.props.onError?.(error, errorInfo)

    // Log to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
      })
    }
  }

  handleReset = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCategory: 'unknown' as ErrorCategory,
      retryCount: prev.retryCount + 1,
    }))
  }

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const categoryMeta = getCategoryMeta(this.state.errorCategory)
      const retryable = this.state.error ? isRetryableError(this.state.error) : true

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${categoryMeta.bgColor}`}
              >
                {categoryMeta.icon}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{categoryMeta.title}</h1>

              <p className="text-gray-600 mb-2">{categoryMeta.description}</p>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-400 mb-4">Retry attempt {this.state.retryCount}</p>
              )}

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-700">
                      <summary className="cursor-pointer font-medium mb-2">Component Stack</summary>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {retryable && (
                  <button
                    onClick={this.handleReset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                )}

                <button
                  onClick={this.handleGoHome}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Functional wrapper for error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Simple error fallback component
 */
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">Error Loading Component</h3>
          <p className="text-sm text-red-700 mb-3">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={resetError}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}

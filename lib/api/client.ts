import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import {
  processApiError,
  getHttpStatusMessage,
  translateMessage,
} from '@/lib/utils/error-message-mapper'
import { envConfig } from '@/lib/config/env-config'

// API Base URL Configuration
// Priority: 1. window.BACKEND_URL (runtime injection)
//           2. envConfig.API_URL (centralized env config — single source of truth)
const getApiBaseURL = () => {
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return `${(window as any).BACKEND_URL}/api`
  }
  return `${envConfig.API_URL}/api`
}

// API Timeout Configuration (T020 — per research.md R7)
export const API_TIMEOUTS = {
  DEFAULT: 60000, // 60s
  FAST: 25000, // 25s — quick reads
  HEAVY: 120000, // 120s — bulk operations, exports
  AUTH: 90000, // 90s — login, register
  UPLOAD: 180000, // 180s — file uploads
} as const

// Route-specific timeout mapping
const getTimeoutForUrl = (url?: string): number => {
  if (!url) return API_TIMEOUTS.DEFAULT
  if (/\/(login|register|logout|verify-otp|forgot-password|reset-password)/.test(url))
    return API_TIMEOUTS.AUTH
  if (/\/upload|\/import|\/bulk/.test(url)) return API_TIMEOUTS.UPLOAD
  if (/\/export|\/generate|\/report/.test(url)) return API_TIMEOUTS.HEAVY
  if (/^\/(qrcodes|folders|templates)\?/.test(url) || /\/count/.test(url)) return API_TIMEOUTS.FAST
  return API_TIMEOUTS.DEFAULT
}

// Check if on slow connection and double timeout
const adjustForSlowConnection = (timeout: number): number => {
  if (typeof navigator === 'undefined') return timeout
  const conn = (navigator as any).connection
  if (!conn) return timeout
  const type = conn.effectiveType
  if (type === 'slow-2g' || type === '2g') return timeout * 2
  return timeout
}

// Auth validation state — suppress 401 redirect/toast while initial /myself call is pending.
// This prevents the "Please log in" flash on page load when the cookie is valid
// but other API calls fire before /myself returns.
let authValidationComplete = false
export function markAuthValidationComplete() {
  authValidationComplete = true
}

const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseURL(),
  timeout: API_TIMEOUTS.DEFAULT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
})

// Request interceptor: Attach JWT token (act-as fallback) and smart timeout.
//
// Normal auth: The httpOnly `auth_token` cookie is sent automatically by the browser
// because `withCredentials: true` is set. No Bearer header is needed.
//
// Act-as (admin impersonation): The impersonation token IS stored in localStorage
// and sent as a Bearer header to override the admin's cookie on the backend.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only attach Bearer token during admin act-as (impersonation) sessions.
    // For normal auth, the httpOnly cookie handles authentication automatically.
    if (typeof window !== 'undefined') {
      const mainUser = localStorage.getItem('mainUser')
      if (mainUser) {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }

    // Let browser set Content-Type with boundary for FormData uploads
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type')
    }

    // Smart timeout: route-specific + slow-connection adjustment (T020)
    const routeTimeout = getTimeoutForUrl(config.url)
    config.timeout = adjustForSlowConnection(routeTimeout)

    // Optional: Add request timestamp for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors and token refresh
apiClient.interceptors.response.use(
  response => {
    // Successful response — dismiss any stale network-error toasts since the connection is fine.
    toast.dismiss('api-network-error')
    toast.dismiss('api-timeout')

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      )
    }
    return response
  },
  async (error: AxiosError) => {
    // Ignore canceled requests — React Query cancels stale/duplicate requests via
    // AbortController as normal behaviour. These are NOT errors.
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _silent?: boolean
    }

    // Handle 401 Unauthorized — verify session is truly dead before redirecting
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Don't redirect if this was the login or register request itself
      const url = originalRequest.url || ''
      const isAuthRequest =
        url.includes('/login') || url.includes('/register') || url.includes('/verify-otp')
      const isMyselfRequest = url.includes('/myself')

      // If auth validation hasn't completed yet, suppress redirect for non-/myself calls.
      // The AuthProvider /myself call will handle cleanup if the cookie is truly invalid.
      if (!authValidationComplete && !isMyselfRequest) {
        return Promise.reject(error)
      }

      if (!isAuthRequest && typeof window !== 'undefined') {
        // For non-/myself 401s, verify the session is truly dead by calling /myself.
        // This prevents transient 401s from specific endpoints from triggering logout.
        if (!isMyselfRequest) {
          try {
            await apiClient.get('/myself')
            // Session is still valid — the 401 was endpoint-specific, not session-related
            return Promise.reject(error)
          } catch {
            // /myself also failed — session is truly dead, proceed with logout
          }
        }

        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('logged_in')
        window.location.href = '/login'
      }

      return Promise.reject(error)
    }

    // Handle 429 Too Many Requests — show rate-limit toast
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers?.['retry-after']
      const message = retryAfter
        ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
        : 'Too many requests. Please wait and try again.'
      toast.error(message)
      return Promise.reject(error)
    }

    // Show user-friendly toast for all other API errors (unless silenced)
    if (!originalRequest._silent && error.response) {
      const status = error.response.status
      const data = error.response.data as any

      // Skip toast for 404 on non-critical endpoints (config, subscriptions/current)
      const silentUrls = ['/config', '/subscriptions/current', '/domains']
      const isSilentUrl = silentUrls.some(u => originalRequest.url?.includes(u))

      if (!isSilentUrl && status !== 401 && (status !== 403 || authValidationComplete)) {
        let userMessage: string

        if (status === 422 && data?.errors) {
          // Validation errors — show first field error
          const fields = Object.keys(data.errors)
          if (fields.length > 0) {
            const firstField = fields[0] as string
            const fieldErrors = data.errors[firstField]
            const firstError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
            userMessage = translateMessage(firstError) || 'Please check your input and try again.'
          } else {
            userMessage = 'Please check your input and try again.'
          }
        } else if (data?.error_code || data?.code) {
          userMessage = processApiError(data)
        } else if (data?.message) {
          userMessage = translateMessage(data.message)
        } else {
          userMessage = getHttpStatusMessage(status)
        }

        toast.error(userMessage)
      }
    } else if (!originalRequest._silent && !error.response) {
      // Network error — no response received.
      // Use toast IDs to deduplicate when multiple requests fail at once (e.g., page load race).
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please check your connection and try again.', {
          id: 'api-timeout',
        })
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Unable to connect to the server. Please check your internet connection.', {
          id: 'api-network-error',
        })
      }
    }

    // Log in dev
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Response Error]', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient

// Re-export axios type guard for convenience
export const isAxiosError = axios.isAxiosError

// Retry with exponential backoff (T020 — 3 retries: 1s, 2s, 4s)
const MAX_RETRIES = 3
const RETRY_DELAY_BASE = 1000

export async function apiWithRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      const isRetryable =
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response?.status && error.response.status >= 500)

      if (!isRetryable || attempt === retries) throw error

      const delay = RETRY_DELAY_BASE * Math.pow(2, attempt)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Retry exhausted')
}

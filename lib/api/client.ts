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
/**
 * Purpose: Retrieves apibaseurl.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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
/**
 * Purpose: Retrieves timeoutforurl.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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
/**
 * Purpose: Executes adjustForSlowConnection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
const adjustForSlowConnection = (timeout: number): number => {
  if (typeof navigator === 'undefined') return timeout
  const conn = (navigator as any).connection
  if (!conn) return timeout
  const type = conn.effectiveType
  if (type === 'slow-2g' || type === '2g') return timeout * 2
  return timeout
}

const AUTH_REQUEST_PATTERN =
  /\/(login|register|logout|verify-otp|forgot-password|reset-password)(\/|$|\?)/

function handleUnauthorizedResponse(config?: InternalAxiosRequestConfig): void {
  if (typeof window === 'undefined') return
  const url = config?.url ?? ''
  if (AUTH_REQUEST_PATTERN.test(url)) return
  if (/\/guest(\/|$|\?)/.test(url)) return

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('logged_in')

  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
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

// Request interceptor: Attach JWT Bearer token and smart timeout.
//
// Primary auth: Bearer token from localStorage (works across localhost/LAN origins).
// Fallback: httpOnly `auth_token` cookie when same-site (withCredentials: true).
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
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
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Request Error]', error)
    }
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

    if (error.response?.status === 401) {
      handleUnauthorizedResponse(originalRequest)
      return Promise.reject(error)
    }

    // Handle 429 Too Many Requests — show rate-limit toast (unless silenced)
    if (error.response?.status === 429) {
      if (!originalRequest._silent) {
        const retryAfter = error.response.headers?.['retry-after']
        const message = retryAfter
          ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
          : 'Too many requests. Please wait and try again.'
        toast.error(message, { id: 'api-rate-limit' })
      }
      return Promise.reject(error)
    }

    // Show user-friendly toast for all other API errors (unless silenced)
    if (!originalRequest._silent && error.response) {
      const status = error.response.status
      const data = error.response.data as Record<string, unknown>

      // Skip toast for 404 on non-critical endpoints (config, subscriptions/current)
      const silentUrls = ['/config', '/subscriptions/current', '/domains']
      const isSilentUrl = silentUrls.some(u => originalRequest.url?.includes(u))
      if (!isSilentUrl && status !== 401) {
        let userMessage: string

        if (status === 422 && data?.errors) {
          const errors = data.errors as Record<string, unknown>
          const fields = Object.keys(errors)
          const firstField = fields[0]
          if (firstField !== undefined) {
            const fieldErrors = errors[firstField]
            const firstError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
            userMessage =
              translateMessage(String(firstError)) || 'Please check your input and try again.'
          } else {
            userMessage = 'Please check your input and try again.'
          }
        } else if (data?.error_code || data?.code) {
          userMessage = processApiError(
            data as { error_code?: string; code?: string; message?: string }
          )
        } else if (status >= 500) {
          userMessage = getHttpStatusMessage(status)
        } else if (data?.message) {
          userMessage = translateMessage(String(data.message))
        } else {
          userMessage = getHttpStatusMessage(status)
        }

        toast.error(userMessage, { id: `api-error-${userMessage}` })
      }
    } else if (!originalRequest._silent && !error.response) {
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

export const isAxiosError = axios.isAxiosError

const MAX_RETRIES = 3
const RETRY_DELAY_BASE = 1000

export async function apiWithRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const axiosErr = isAxiosError(error) ? error : null
      const isRetryable =
        axiosErr?.code === 'ECONNABORTED' ||
        axiosErr?.code === 'ERR_NETWORK' ||
        (axiosErr?.response?.status != null && axiosErr.response.status >= 500)

      if (!isRetryable || attempt === retries) throw error

      const delay = RETRY_DELAY_BASE * Math.pow(2, attempt)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Retry exhausted')
}

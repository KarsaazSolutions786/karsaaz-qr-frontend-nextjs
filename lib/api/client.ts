import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { translateMessage } from '@/lib/utils/error-message-mapper'
import { envConfig } from '@/lib/config/env-config'
import { ApiError } from './error'

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

const getTimeoutForUrl = (url?: string): number => {
  if (!url) return API_TIMEOUTS.DEFAULT
  if (/\/(login|register|logout|verify-otp|forgot-password|reset-password)/.test(url))
    return API_TIMEOUTS.AUTH
  if (/\/upload|\/import|\/bulk/.test(url)) return API_TIMEOUTS.UPLOAD
  if (/\/export|\/generate|\/report/.test(url)) return API_TIMEOUTS.HEAVY
  if (/^\/(qrcodes|folders|templates)\?/.test(url) || /\/count/.test(url)) return API_TIMEOUTS.FAST
  return API_TIMEOUTS.DEFAULT
}

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

  const isGuestCapablePage = /^\/(guest|qrcodes)(\/|$)/.test(window.location.pathname)
  if (isGuestCapablePage && localStorage.getItem('guest_session_token')) return

  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login?reason=session_expired'
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

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type')
    }

    const routeTimeout = getTimeoutForUrl(config.url)
    config.timeout = adjustForSlowConnection(routeTimeout)

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

apiClient.interceptors.response.use(
  response => {
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
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _silent?: boolean
    }

    const apiError = ApiError.fromAxiosError(error)

    if (error.response?.status === 401) {
      handleUnauthorizedResponse(originalRequest)
      return Promise.reject(apiError)
    }

    if (error.response?.status === 429) {
      if (!originalRequest._silent) {
        toast.error(apiError.message, { id: 'api-rate-limit' })
      }
      return Promise.reject(apiError)
    }
    if (!originalRequest._silent && error.response) {
      const status = error.response.status

      // Skip toast for 404 on non-critical endpoints (config, subscriptions/current)
      const silentUrls = ['/config', '/subscriptions/current', '/domains']
      const isSilentUrl = silentUrls.some(u => originalRequest.url?.includes(u))
      if (!isSilentUrl && status !== 401) {
        let userMessage = apiError.message
        if (status === 422 && apiError.message) {
          userMessage = translateMessage(apiError.message) || apiError.message
        } else if (apiError.message) {
          userMessage = translateMessage(apiError.message) || apiError.message
        }

        toast.error(userMessage, { id: `api-error-${userMessage}` })
      }
    } else if (!originalRequest._silent && !error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error(apiError.message, { id: 'api-timeout' })
      } else if (error.code === 'ERR_NETWORK') {
        toast.error(apiError.message, { id: 'api-network-error' })
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[API Response Error]', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
      })
    }

    return Promise.reject(apiError)
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

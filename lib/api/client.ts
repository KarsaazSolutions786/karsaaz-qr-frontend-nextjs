import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// API Base URL Configuration (matches Lit frontend priority)
// 1. NEXT_PUBLIC_API_URL environment variable
// 2. Fallback to production URL
const getApiBaseURL = () => {
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return `${(window as any).BACKEND_URL}/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'https://app.karsaazqr.com/api';
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 60000, // 60s timeout (matches Lit frontend default)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
})

// Request interceptor: Attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get Sanctum token from localStorage and attach to request
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
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
  (response) => {
    // Successful response - return data
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized — clear auth and redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Don't redirect if this was the login or register request itself
      const url = originalRequest.url || ''
      const isAuthRequest = url.includes('/login') || url.includes('/register') || url.includes('/verify-otp')
      
      if (!isAuthRequest && typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }

    // Handle other errors
    console.error('[API Response Error]', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    })

    return Promise.reject(error)
  }
)

export default apiClient

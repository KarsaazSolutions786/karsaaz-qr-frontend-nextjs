import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 5000, // Reduced timeout for faster failure detection
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests (for JWT in httpOnly cookie)
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

    // Handle 401 Unauthorized (expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh token (backend should handle refresh via httpOnly cookie)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
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

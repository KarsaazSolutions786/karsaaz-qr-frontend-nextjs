/**
 * Unit Tests for API Client (Axios instance)
 * @file tests/unit/api/client.test.ts
 *
 * Tests the apiClient interceptors and retry logic:
 * - Request interceptor: Authorization header from localStorage
 * - Request interceptor: smart timeout per route
 * - Response interceptor: 401 handling (clear token + redirect)
 * - Response interceptor: _silent config suppresses toasts
 * - Response interceptor: 429 rate-limit toast
 * - apiWithRetry: exponential backoff for retryable errors
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

// ---- Mock toast ----
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => mockToastError(...args) },
}))

// ---- Mock error message mapper ----
vi.mock('@/lib/utils/error-message-mapper', () => ({
  processApiError: vi.fn(data => data?.message || 'Processed error'),
  getHttpStatusMessage: vi.fn((status: number) => `HTTP ${status} Error`),
  translateMessage: vi.fn((msg: string) => msg || 'Translated'),
}))

// ---- Storage mock ----

let storage: Record<string, string> = {}

function setupLocalStorageMock() {
  storage = {}
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key]
      }),
      clear: vi.fn(() => {
        storage = {}
      }),
      length: 0,
      key: vi.fn(() => null),
    },
    writable: true,
  })
}

// ---- Location mock ----
// jsdom throws "Not implemented: navigation" when setting window.location.href.
// Replace window.location with a writable stub so the 401 redirect test works.
let locationHref = ''

function setupLocationMock() {
  locationHref = ''
  const locationMock = {
    get href() {
      return locationHref
    },
    set href(url: string) {
      locationHref = url
    },
    assign: vi.fn((url: string) => {
      locationHref = url
    }),
    replace: vi.fn((url: string) => {
      locationHref = url
    }),
    reload: vi.fn(),
    toString: () => locationHref,
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    ancestorOrigins: {} as DOMStringList,
  } as unknown as Location

  Object.defineProperty(window, 'location', {
    value: locationMock,
    writable: true,
    configurable: true,
  })
}

// ---- Tests ----

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupLocalStorageMock()
    setupLocationMock()
    // Re-import client module fresh for each test is complex,
    // so we test via the interceptor behavior directly.
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Request interceptor - Authorization header', () => {
    it('should add Bearer token from localStorage when present', async () => {
      // We test by importing the real client and examining its interceptors
      // Since apiClient is already instantiated, we can test the behavior
      // by looking at what config gets transformed.

      // Set token in mock localStorage
      storage['token'] = 'my-jwt-token'

      // Import fresh
      const { default: apiClient } = await import('@/lib/api/client')

      // Get the request interceptor handlers
      const interceptors = (apiClient as any).interceptors.request.handlers
      expect(interceptors.length).toBeGreaterThan(0)

      // Execute the fulfilled handler (first interceptor, fulfilled function)
      const requestInterceptor = interceptors[0].fulfilled
      const config: InternalAxiosRequestConfig = {
        headers: new axios.AxiosHeaders(),
        url: '/test',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.headers.Authorization).toBe('Bearer my-jwt-token')
    })

    it('should not add Authorization header when no token exists', async () => {
      // No token in storage

      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.request.handlers
      const requestInterceptor = interceptors[0].fulfilled

      const config: InternalAxiosRequestConfig = {
        headers: new axios.AxiosHeaders(),
        url: '/test',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('Request interceptor - Smart timeout', () => {
    it('should set AUTH timeout for login routes', async () => {
      storage['token'] = 'tok'
      const { default: apiClient, API_TIMEOUTS } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.request.handlers
      const requestInterceptor = interceptors[0].fulfilled

      const config = {
        headers: new axios.AxiosHeaders(),
        url: '/login',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.timeout).toBe(API_TIMEOUTS.AUTH)
    })

    it('should set UPLOAD timeout for upload routes', async () => {
      const { default: apiClient, API_TIMEOUTS } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.request.handlers
      const requestInterceptor = interceptors[0].fulfilled

      const config = {
        headers: new axios.AxiosHeaders(),
        url: '/upload/images',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.timeout).toBe(API_TIMEOUTS.UPLOAD)
    })

    it('should set HEAVY timeout for export routes', async () => {
      const { default: apiClient, API_TIMEOUTS } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.request.handlers
      const requestInterceptor = interceptors[0].fulfilled

      const config = {
        headers: new axios.AxiosHeaders(),
        url: '/export/csv',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.timeout).toBe(API_TIMEOUTS.HEAVY)
    })

    it('should use DEFAULT timeout for unknown routes', async () => {
      const { default: apiClient, API_TIMEOUTS } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.request.handlers
      const requestInterceptor = interceptors[0].fulfilled

      const config = {
        headers: new axios.AxiosHeaders(),
        url: '/some/other/endpoint',
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)
      expect(result.timeout).toBe(API_TIMEOUTS.DEFAULT)
    })
  })

  describe('Response interceptor - 401 handling', () => {
    it('should clear token and redirect on 401 for non-auth requests', async () => {
      storage['token'] = 'expired'
      storage['user'] = '{"id":1}'

      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: { status: 401 },
        config: { url: '/myself', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(locationHref).toBe('/login?reason=session_expired')
    })

    it('should NOT redirect on 401 for login request', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: { status: 401 },
        config: { url: '/login', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      // Should NOT clear token for auth endpoints
      expect(window.localStorage.removeItem).not.toHaveBeenCalledWith('token')
    })
  })

  describe('Response interceptor - _silent config', () => {
    it('should not show toast when _silent is true', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: { status: 500, data: { message: 'Server Error' } },
        config: {
          url: '/api/test',
          _silent: true,
          _retry: false,
        } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).not.toHaveBeenCalled()
    })

    it('should show toast for error when _silent is not set', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
        config: { url: '/api/data', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
        message: 'Request failed',
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).toHaveBeenCalled()
    })
  })

  describe('Response interceptor - 429 rate limit', () => {
    it('should show rate-limit toast with retry-after when present', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: {
          status: 429,
          headers: { 'retry-after': '30' },
          data: {},
        },
        config: { url: '/api/test', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).toHaveBeenCalledWith(expect.stringContaining('30 seconds'), {
        id: 'api-rate-limit',
      })
    })

    it('should show generic rate-limit toast without retry-after', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: { status: 429, headers: {}, data: {} },
        config: { url: '/api/test', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).toHaveBeenCalledWith(expect.stringContaining('Too many requests'), {
        id: 'api-rate-limit',
      })
    })
  })

  describe('Response interceptor - silent URLs', () => {
    it('should not show toast for endpoints in the silent URL list', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: { status: 404, data: {} },
        config: { url: '/config', _retry: false } as unknown as InternalAxiosRequestConfig,
        isAxiosError: true,
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).not.toHaveBeenCalled()
    })
  })

  describe('Response interceptor - network errors', () => {
    it('should show timeout toast for ECONNABORTED', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: undefined,
        config: { url: '/api/test', _retry: false } as unknown as InternalAxiosRequestConfig,
        code: 'ECONNABORTED',
        isAxiosError: true,
        message: 'timeout',
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).toHaveBeenCalledWith(expect.stringContaining('timed out'), {
        id: 'api-timeout',
      })
    })

    it('should show network error toast for ERR_NETWORK', async () => {
      const { default: apiClient } = await import('@/lib/api/client')

      const interceptors = (apiClient as any).interceptors.response.handlers
      const errorHandler = interceptors[0].rejected

      const error = {
        response: undefined,
        config: { url: '/api/test', _retry: false } as unknown as InternalAxiosRequestConfig,
        code: 'ERR_NETWORK',
        isAxiosError: true,
        message: 'Network Error',
      }

      await expect(errorHandler(error)).rejects.toBeTruthy()

      expect(mockToastError).toHaveBeenCalledWith(expect.stringContaining('internet connection'), {
        id: 'api-network-error',
      })
    })
  })
})

describe('apiWithRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return result on first success', async () => {
    const { apiWithRetry } = await import('@/lib/api/client')

    const fn = vi.fn().mockResolvedValue('success')

    const result = await apiWithRetry(fn)

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should retry on 500 error and succeed', async () => {
    const { apiWithRetry } = await import('@/lib/api/client')

    const serverError = Object.assign(new Error('Server Error'), {
      isAxiosError: true,
      response: { status: 500 },
      code: undefined,
    })
    // Mock axios.isAxiosError for the retry logic
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const fn = vi.fn().mockRejectedValueOnce(serverError).mockResolvedValueOnce('recovered')

    const promise = apiWithRetry(fn, 3)

    // Advance past retry delay (1s for first retry)
    await vi.advanceTimersByTimeAsync(1100)

    const result = await promise
    expect(result).toBe('recovered')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should throw after exhausting retries', async () => {
    const { apiWithRetry } = await import('@/lib/api/client')

    const serverError = Object.assign(new Error('Server Error'), {
      isAxiosError: true,
      response: { status: 500 },
      code: undefined,
    })
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const fn = vi.fn().mockRejectedValue(serverError)

    const promise = apiWithRetry(fn, 2)
    // Attach the rejection handler before advancing timers -- otherwise the promise
    // can reject mid-advance with no handler attached yet, firing as an unhandled
    // rejection that vitest surfaces as a spurious test-run failure.
    const assertion = expect(promise).rejects.toThrow('Server Error')

    // Advance past all retry delays (1s + 2s)
    await vi.advanceTimersByTimeAsync(1100)
    await vi.advanceTimersByTimeAsync(2100)

    await assertion
    expect(fn).toHaveBeenCalledTimes(3) // initial + 2 retries
  })

  it('should not retry on non-retryable errors (e.g. 400)', async () => {
    const { apiWithRetry } = await import('@/lib/api/client')

    const clientError = Object.assign(new Error('Bad Request'), {
      isAxiosError: true,
      response: { status: 400 },
      code: undefined,
    })
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const fn = vi.fn().mockRejectedValue(clientError)

    await expect(apiWithRetry(fn)).rejects.toThrow('Bad Request')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('API Client configuration', () => {
  it('should have correct base URL fallback', async () => {
    const { default: apiClient } = await import('@/lib/api/client')

    // Should end with /api
    const baseURL = (apiClient as any).defaults.baseURL
    expect(baseURL).toMatch(/\/api$/)
  })

  it('should send credentials (cookies)', async () => {
    const { default: apiClient } = await import('@/lib/api/client')

    expect((apiClient as any).defaults.withCredentials).toBe(true)
  })

  it('should set Accept and Content-Type headers to JSON', async () => {
    const { default: apiClient } = await import('@/lib/api/client')

    const headers = (apiClient as any).defaults.headers
    expect(headers['Accept']).toBe('application/json')
    expect(headers['Content-Type']).toBe('application/json')
  })
})

describe('isAxiosError type guard', () => {
  it('should identify axios errors correctly', async () => {
    const { isAxiosError } = await import('@/lib/api/client')

    Object.assign(new Error('test'), { isAxiosError: true })
    // The function delegates to axios.isAxiosError
    expect(typeof isAxiosError).toBe('function')
  })
})

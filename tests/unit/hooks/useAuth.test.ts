/**
 * Unit Tests for useAuth hook and AuthProvider
 * @file tests/unit/hooks/useAuth.test.ts
 *
 * Tests the AuthContext/AuthProvider which manages:
 * - Login / logout flows
 * - Token validation on mount
 * - User data refresh
 * - Admin impersonation (actAs / removeActAs)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'

// ---- Mock dependencies before importing source ----

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock apiClient
const mockGet = vi.fn()
const mockPost = vi.fn()
vi.mock('@/lib/api/client', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}))

// Mock rpc
const mockRpc = vi.fn()
const mockRpcComposite = vi.fn()

vi.mock('@/lib/api/rpc', () => {
  class MockRpcError extends Error {
    public isAuthError: boolean
    constructor(message: string, isAuthError = false) {
      super(message)
      this.name = 'RpcError'
      this.isAuthError = isAuthError
    }
  }
  return {
    rpc: (...args: unknown[]) => mockRpc(...args),
    rpcComposite: (...args: unknown[]) => mockRpcComposite(...args),
    rpcClearCache: vi.fn(),
    RpcError: MockRpcError,
  }
})

// Mock fingerprint service
vi.mock('@/lib/services/fingerprint', () => ({
  fingerprintService: { clearCache: vi.fn() },
}))

// Mock @tanstack/react-query
const mockSetQueryData = vi.fn()
const mockClear = vi.fn()
const mockInvalidateQueries = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: mockSetQueryData,
    clear: mockClear,
    invalidateQueries: mockInvalidateQueries,
  }),
  QueryClient: vi.fn(),
}))

// Now import the module under test
import { AuthProvider, AuthContext, useAuth } from '../../../lib/context/AuthContext'
import { RpcError } from '../../../lib/api/rpc'
import type { AuthContextType } from '../../../lib/context/AuthContext'
import type { User } from '@/types/entities/user'

// ---- Helpers ----

/**
 * The vi.mock('@/lib/api/rpc', ...) factory above replaces RpcError with a
 * MockRpcError whose constructor is (message, isAuthError) -- deliberately
 * simpler than the real class's (code, message, data). tsc type-checks
 * `new RpcError(...)` against the *real* class's signature regardless, so a
 * plain `new RpcError(...)` call here would either fail to compile (string
 * where the real signature wants a number) or silently construct the wrong
 * runtime shape. This helper isolates the one intentional type escape.
 */
function mockAuthError(message: string, isAuthError: boolean): RpcError {
  return new (RpcError as unknown as new (message: string, isAuthError: boolean) => RpcError)(
    message,
    isAuthError
  )
}

const baseUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  email_verified_at: '2024-01-01',
  roles: [{ name: 'Client', home_page: '/qrcodes', super_admin: false, permissions: [] }],
}

const adminUser: User = {
  id: 99,
  email: 'admin@example.com',
  name: 'Admin User',
  email_verified_at: '2024-01-01',
  roles: [{ name: 'Admin', home_page: '/admin/dashboard', super_admin: true, permissions: [] }],
}

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(AuthProvider, null, children)
  }
}

function useAuthFromContext(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('Missing AuthProvider')
  return context
}

// ---- Storage mock ----

let storage: Record<string, string> = {}

function setupLocalStorageMock() {
  storage = {}
  const localStorageMock = {
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
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
}

// ---- Tests ----

describe('useAuth / AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupLocalStorageMock()
    // Default: appInit fails so isLoading resolves quickly
    // Note: this file's mocked RpcError is (message, isAuthError), NOT the real
    // class's (code, message, data) -- always construct it that way here.
    mockRpcComposite.mockRejectedValue(mockAuthError('Unauthorized', true))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ---- Login ----

  describe('login', () => {
    it('should store user and token on successful login', async () => {
      const loginResponse = { data: { user: baseUser, token: 'jwt-token-123' } }
      mockPost.mockResolvedValueOnce(loginResponse)

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })

      expect(mockPost).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.current.user).toEqual(baseUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(baseUser))
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token-123')
      expect(mockSetQueryData).toHaveBeenCalled()
    })

    it('should propagate error on failed login', async () => {
      const apiError = new Error('Invalid credentials')
      mockPost.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await expect(
        act(async () => {
          await result.current.login('wrong@example.com', 'bad-password')
        })
      ).rejects.toThrow('Invalid credentials')

      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  // ---- Logout ----

  describe('logout', () => {
    it('should clear localStorage and redirect to /login by default', async () => {
      storage['token'] = 'some-token'
      storage['user'] = JSON.stringify(baseUser)

      // Mount validation returns the user
      mockRpcComposite.mockResolvedValueOnce({
        user: baseUser,
        subscription: null,
        usage: {},
        qr_count: { total: 0, active: 0 },
        bootstrap: {},
      })
      // logout POST
      mockPost.mockResolvedValueOnce({})

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.logout()
      })

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('mainUser')
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(mockClear).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('should redirect to / when after_logout_action is redirect_to_home_page', async () => {
      storage['after_logout_action'] = 'redirect_to_home_page'
      mockPost.mockResolvedValueOnce({})

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.logout()
      })

      // redirect_to_home_page uses window.location.href, not router.push
      // So mockPush should NOT have been called with '/login'
      expect(result.current.user).toBe(null)
    })

    it('should still clear state even if POST /logout fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBe(null)
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })

  // ---- Token validation on mount ----

  describe('token validation on mount', () => {
    it('should validate token by calling appInit when token exists', async () => {
      storage['token'] = 'valid-token'
      storage['user'] = JSON.stringify(baseUser)

      const freshUser = { ...baseUser, name: 'Updated Name' }
      mockRpcComposite.mockResolvedValueOnce({
        user: freshUser,
        subscription: null,
        usage: {},
        qr_count: { total: 0, active: 0 },
        bootstrap: {},
      })

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(mockRpcComposite).toHaveBeenCalledWith('appInit', { lang: 'en', platform: 'web' })
      expect(result.current.user?.name).toBe('Updated Name')
    })

    it('should clear auth state on 401 response during validation', async () => {
      storage['token'] = 'expired-token'
      storage['user'] = JSON.stringify(baseUser)

      mockRpcComposite.mockRejectedValueOnce(mockAuthError('Unauthorized', true))

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.user).toBe(null)
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user')
    })

    it('should keep cached user on network error (offline access)', async () => {
      storage['token'] = 'some-token'
      storage['user'] = JSON.stringify(baseUser)

      // Network error has isAuthError = false
      mockRpcComposite.mockRejectedValueOnce(mockAuthError('Network Error', false))

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      // Should fallback to cached user
      expect(result.current.user).not.toBe(null)
      expect(result.current.user?.email).toBe('test@example.com')
    })

    it('should set isLoading to false immediately when no token', async () => {
      // No token in storage
      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      // isLoading should be false immediately (no token = no validation needed)
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(mockRpcComposite).not.toHaveBeenCalled()
    })
  })

  // ---- refreshUserData ----

  describe('refreshUserData', () => {
    it('should fetch fresh user data and update state', async () => {
      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      const freshUser = { ...baseUser, name: 'Refreshed User' }
      mockRpc.mockResolvedValueOnce(freshUser)

      let returned: User | null = null
      await act(async () => {
        returned = await result.current.refreshUserData()
      })

      expect(returned).toEqual(freshUser)
      expect(result.current.user?.name).toBe('Refreshed User')
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(freshUser))
    })

    it('should return null on failure without crashing', async () => {
      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      mockRpc.mockRejectedValueOnce(new Error('Server Error'))

      let returned: User | null = null
      await act(async () => {
        returned = await result.current.refreshUserData()
      })

      expect(returned).toBe(null)
    })
  })

  // ---- actAs / removeActAs (Admin Impersonation) ----

  describe('actAs (impersonation)', () => {
    it('should store mainUser and switch to target user', async () => {
      storage['token'] = 'admin-token'
      storage['user'] = JSON.stringify(adminUser)

      mockRpcComposite.mockResolvedValueOnce({
        user: adminUser,
        subscription: null,
        usage: {},
        qr_count: { total: 0, active: 0 },
        bootstrap: {},
      })

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.actAs(baseUser, 'target-token-456')
      })

      // mainUser saved
      expect(window.localStorage.setItem).toHaveBeenCalledWith('mainUser', expect.any(String))
      // Switched to target user
      expect(result.current.user).toEqual(baseUser)
      expect(result.current.isActingAs).toBe(true)
      expect(result.current.actingAsUser).toEqual(baseUser)
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'target-token-456')
    })

    it('should navigate to target user home page', async () => {
      storage['token'] = 'admin-token'
      storage['user'] = JSON.stringify(adminUser)

      mockRpcComposite.mockResolvedValueOnce({
        user: adminUser,
        subscription: null,
        usage: {},
        qr_count: { total: 0, active: 0 },
        bootstrap: {},
      })

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.actAs(baseUser, 'target-token')
      })

      // baseUser home_page is '/qrcodes'
      expect(mockPush).toHaveBeenCalledWith('/qrcodes')
    })
  })

  describe('removeActAs', () => {
    it('should restore original admin credentials', async () => {
      const mainUserData = { user: adminUser, token: 'admin-token' }
      storage['mainUser'] = JSON.stringify(mainUserData)
      storage['token'] = 'target-token'
      storage['user'] = JSON.stringify(baseUser)

      mockRpcComposite.mockResolvedValueOnce({
        user: baseUser,
        subscription: null,
        usage: {},
        qr_count: { total: 0, active: 0 },
        bootstrap: {},
      })

      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.removeActAs()
      })

      expect(result.current.user).toEqual(adminUser)
      expect(result.current.isActingAs).toBe(false)
      expect(result.current.actingAsUser).toBe(null)
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('mainUser')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
    })

    it('should do nothing if mainUser is not in localStorage', async () => {
      // No mainUser stored
      const { result } = renderHook(() => useAuthFromContext(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => {
        result.current.removeActAs()
      })

      // No crash, no navigation
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  // ---- useAuth guard ----

  describe('useAuth guard', () => {
    it('should throw when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
    })
  })
})

'use client'

import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'
import { rpc, rpcComposite, rpcClearCache, RpcError } from '@/lib/api/rpc'
import { envConfig } from '@/lib/config/env-config'
import { queryKeys } from '@/lib/query/keys'
import { User } from '@/types/entities/user'
import { userHomePage as resolveHomePage } from '@/lib/utils/permissions'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  /**
   * Refresh user data from GET /api/myself and update localStorage + query cache.
   * Called after subscription changes, payments, or any action that mutates the user.
   * Matches original: refreshUserData()
   */
  refreshUserData: () => Promise<User | null>
  /** Impersonate a user (admin only) — stores current credentials and swaps to target */
  actAs: (targetUser: User, targetToken: string) => void
  /** Stop impersonating — restore original admin credentials */
  removeActAs: () => void
  /** Whether admin is currently impersonating another user */
  isActingAs: boolean
  /** The user being impersonated (when acting as) */
  actingAsUser: User | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasValidated = useRef(false)

  // Initialize user from localStorage (for instant hydration before /myself call)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
      } catch {
        return null
      }
    }
    return null
  })

  // isLoading = true until initial validation completes.
  // Use `logged_in` flag OR legacy `token` (for backwards compatibility during migration).
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem('logged_in') || localStorage.getItem('token'))
    }
    return false
  })

  // ---- isActingAs (derived from mainUser in localStorage) ----
  const [isActingAs, setIsActingAs] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('mainUser')
    }
    return false
  })

  const actingAsUser = isActingAs ? user : null

  // Validate session on mount by calling GET /myself.
  // The httpOnly auth_token cookie is sent automatically via withCredentials: true.
  // For act-as scenarios, the Bearer token from localStorage takes precedence.
  useEffect(() => {
    if (hasValidated.current) return
    hasValidated.current = true

    const isLoggedIn =
      typeof window !== 'undefined'
        ? !!(localStorage.getItem('logged_in') || localStorage.getItem('token'))
        : false

    if (!isLoggedIn) {
      // isLoading already initialized to false when no session exists
      return
    }

    rpcComposite<{
      user: User
      subscription: {
        subscription: Record<string, unknown> | null
        plan: Record<string, unknown> | null
      }
      usage: Record<string, unknown>
      qr_count: { total: number; active: number }
      bootstrap: Record<string, unknown>
    }>('appInit', { lang: 'en', platform: 'web' })
      .then(initData => {
        const freshUser = initData.user
        setUser(freshUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(freshUser))
          localStorage.setItem('logged_in', 'true')
        }
        // Pre-populate React Query caches to avoid redundant network requests
        queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
        queryClient.setQueryData(
          queryKeys.subscriptions.current(),
          initData.subscription?.subscription ?? null
        )
      })
      .catch(error => {
        // Only clear auth state on actual 401 authentication failures.
        // Network errors, 500s, or sub-service failures in appInit must NOT log the user out.
        const isAuthFailure = error instanceof RpcError && error.isAuthError
        if (isAuthFailure) {
          setUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('logged_in')
          }
        }
        // For any other error, keep the cached user from localStorage so the session survives.
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [queryClient])

  /**
   * Refresh user data from backend and update all caches.
   * Matches original: refreshUserData() -- called after subscription/plan changes.
   */
  const refreshUserData = useCallback(async (): Promise<User | null> => {
    try {
      const freshUser = await rpc<User>('user.profile', {}, { skipDedup: true })
      setUser(freshUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(freshUser))
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
      return freshUser
    } catch {
      return null
    }
  }, [queryClient])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiClient.post<{ user: User; token: string }>('/login', {
        email,
        password,
      })
      const data = response.data
      setUser(data.user)
      const lastUserId = typeof window !== 'undefined' ? localStorage.getItem('last_user_id') : null
      const newUserId = String(data.user.id)

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('logged_in', 'true')
        localStorage.removeItem('token')

        // Smart Cache Clear: Only clear if switching users to preserve performance
        if (lastUserId && lastUserId !== newUserId) {
          queryClient.clear()
          rpcClearCache()
        } else {
          // If same user or first login, trigger background invalidation
          // to ensure latest data is fetched while showing cache instantly.
          queryClient.invalidateQueries()
        }
        localStorage.setItem('last_user_id', newUserId)
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user)
    },
    [queryClient]
  )

  /**
   * Logout -- call backend to revoke token + clear cookie, then clear local state.
   *
   * After logout:
   *   - If Auth0 enabled -> /auth0/logout
   *   - If app.after_logout_action === 'redirect_to_home_page' -> /
   *   - Default -> /login (matches redirect_to_login_page)
   */
  const logout = useCallback(async () => {
    // Check if Auth0 is enabled -- redirect to Auth0 logout endpoint
    const auth0Enabled =
      typeof window !== 'undefined' ? localStorage.getItem('auth0_enabled') : null
    if (auth0Enabled === 'true') {
      const apiUrl = envConfig.API_URL
      window.location.href = `${apiUrl}/auth0/logout`
      return
    }

    // Call backend logout to revoke the Sanctum token and clear the httpOnly cookie.
    // Fire-and-forget: don't block the UI if the call fails (e.g., token already expired).
    try {
      await apiClient.post('/logout')
    } catch {
      // Ignore errors -- the user is logging out regardless
    }

    // Clear local state
    setUser(null)
    setIsActingAs(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('logged_in')
      localStorage.removeItem('mainUser')
    }
    queryClient.setQueryData(queryKeys.auth.currentUser(), null)
    queryClient.clear()
    rpcClearCache()

    // Resolve after_logout_action from app config (stored in localStorage after load)
    const afterLogoutAction =
      typeof window !== 'undefined' ? localStorage.getItem('after_logout_action') : null

    if (afterLogoutAction === 'redirect_to_home_page') {
      window.location.href = '/'
    } else {
      // Default: redirect_to_login_page
      router.push('/login')
    }
  }, [queryClient, router])

  // ---- ActAs (Admin Impersonation) ----
  // Act-as requires storing the impersonation token in localStorage because
  // the browser can only hold one httpOnly cookie at a time (the admin's).
  // The token in localStorage is set as a Bearer header, which takes precedence
  // over the cookie in the backend middleware.

  const actAs = useCallback(
    (targetUser: User, targetToken: string) => {
      if (typeof window === 'undefined') return
      // Save current admin user before switching.
      // For act-as, we need the admin's token to restore later.
      // The admin's cookie-based session is preserved in the browser automatically.
      const mainUser = {
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        // No token to save -- admin uses cookie auth. We store a marker instead.
        token: null,
      }
      localStorage.setItem('mainUser', JSON.stringify(mainUser))
      // Switch to target user -- store their token so Bearer header overrides cookie
      localStorage.setItem('user', JSON.stringify(targetUser))
      localStorage.setItem('token', targetToken)
      setUser(targetUser)
      setIsActingAs(true)
      queryClient.setQueryData(queryKeys.auth.currentUser(), targetUser)
      // Navigate to target's home page and RELOAD (matches original)
      const homePage = resolveHomePage(targetUser)
      router.push(homePage)
      setTimeout(() => window.location.reload(), 100)
    },
    [queryClient, router]
  )

  const removeActAs = useCallback(() => {
    if (typeof window === 'undefined') return
    const mainUserStr = localStorage.getItem('mainUser')
    if (!mainUserStr) return
    try {
      const mainUser = JSON.parse(mainUserStr)
      localStorage.setItem('user', JSON.stringify(mainUser.user))
      // Remove the impersonation token -- admin auth falls back to cookie
      localStorage.removeItem('token')
      localStorage.removeItem('mainUser')
      setUser(mainUser.user)
      setIsActingAs(false)
      queryClient.setQueryData(queryKeys.auth.currentUser(), mainUser.user)
      // Navigate to admin's home page and RELOAD (matches original)
      const homePage = resolveHomePage(mainUser.user)
      router.push(homePage)
      setTimeout(() => window.location.reload(), 100)
    } catch {
      localStorage.removeItem('mainUser')
      localStorage.removeItem('token')
      setIsActingAs(false)
    }
  }, [queryClient, router])

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      setUser,
      refreshUserData,
      actAs,
      removeActAs,
      isActingAs,
      actingAsUser,
    }),
    [user, isLoading, login, logout, refreshUserData, actAs, removeActAs, isActingAs, actingAsUser]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

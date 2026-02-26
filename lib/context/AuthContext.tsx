'use client'

import React, { createContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'
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

  // Initialize user from localStorage
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

  // isLoading = true until initial token validation completes
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token')
    }
    return false
  })

  // ── isActingAs (derived from mainUser in localStorage) ──
  const [isActingAs, setIsActingAs] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('mainUser')
    }
    return false
  })

  const actingAsUser = isActingAs ? user : null

  // Validate token on mount by calling GET /myself
  // Matches original: validateCurrentToken() on DOMContentLoaded
  useEffect(() => {
    if (hasValidated.current) return
    hasValidated.current = true

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setIsLoading(false)
      return
    }

    apiClient.get<{ data: User }>('/myself')
      .then((response) => {
        const freshUser = (response.data as any).data ?? response.data
        setUser(freshUser as User)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(freshUser))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
        // Subscription data is now managed by TanStack Query via useSubscription hook
      })
      .catch(() => {
        // Token is invalid — clear everything, matches auth:invalid-token handler
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [queryClient])

  /**
   * Refresh user data from backend and update all caches.
   * Matches original: refreshUserData() — called after subscription/plan changes.
   */
  const refreshUserData = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<{ data: User }>('/myself')
      const freshUser = (response.data as any).data ?? response.data as unknown as User
      setUser(freshUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(freshUser))
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
      // Subscription data is automatically updated via TanStack Query when user data changes
      return freshUser
    } catch {
      return null
    }
  }, [queryClient])

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User; token: string }>('/login', {
      email,
      password,
    })
    const data = response.data
    setUser(data.user)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
    }
    queryClient.setQueryData(queryKeys.auth.currentUser(), data.user)
    // Subscription data is automatically loaded via TanStack Query when user data is set
  }, [queryClient])

  /**
   * Logout — clear credentials and redirect.
   * Matches original session lifecycle including after_logout_action config and Auth0.
   *
   * After logout:
   *   - If Auth0 enabled → /auth0/logout
   *   - If app.after_logout_action === 'redirect_to_home_page' → /
   *   - Default → /login (matches redirect_to_login_page)
   */
  const logout = useCallback(async () => {
    // Check if Auth0 is enabled — redirect to Auth0 logout endpoint
    const auth0Enabled = typeof window !== 'undefined' ? localStorage.getItem('auth0_enabled') : null
    if (auth0Enabled === 'true') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com'
      window.location.href = `${apiUrl}/auth0/logout`
      return
    }

    try {
      await apiClient.post('/logout')
    } catch {
      // Ignore — we clear local state regardless
    }

    setUser(null)
    setIsActingAs(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('mainUser')
    }
    queryClient.setQueryData(queryKeys.auth.currentUser(), null)
    queryClient.clear()

    // Resolve after_logout_action from app config (stored in localStorage after load)
    const afterLogoutAction = typeof window !== 'undefined'
      ? localStorage.getItem('after_logout_action')
      : null

    if (afterLogoutAction === 'redirect_to_home_page') {
      window.location.href = '/'
    } else {
      // Default: redirect_to_login_page
      router.push('/login')
    }
  }, [queryClient, router])

  // ── ActAs (Admin Impersonation) ──
  // Matches original: actAs stores mainUser, swaps credentials, navigates + reloads

  const actAs = useCallback((targetUser: User, targetToken: string) => {
    if (typeof window === 'undefined') return
    // Save current admin user before switching
    const mainUser = {
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      token: localStorage.getItem('token'),
    }
    localStorage.setItem('mainUser', JSON.stringify(mainUser))
    // Switch to target user
    localStorage.setItem('user', JSON.stringify(targetUser))
    localStorage.setItem('token', targetToken)
    setUser(targetUser)
    setIsActingAs(true)
    queryClient.setQueryData(queryKeys.auth.currentUser(), targetUser)
    // Navigate to target's home page and RELOAD (matches original)
    const homePage = resolveHomePage(targetUser)
    router.push(homePage)
    setTimeout(() => window.location.reload(), 100)
  }, [queryClient, router])

  const removeActAs = useCallback(() => {
    if (typeof window === 'undefined') return
    const mainUserStr = localStorage.getItem('mainUser')
    if (!mainUserStr) return
    try {
      const mainUser = JSON.parse(mainUserStr)
      localStorage.setItem('user', JSON.stringify(mainUser.user))
      localStorage.setItem('token', mainUser.token)
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
      setIsActingAs(false)
    }
  }, [queryClient, router])

  const contextValue: AuthContextType = {
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
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

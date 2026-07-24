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
  refreshUserData: () => Promise<User | null>
  actAs: (targetUser: User, targetToken: string) => void
  removeActAs: () => void
  isActingAs: boolean
  actingAsUser: User | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasValidated = useRef(false)

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

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem('logged_in') || localStorage.getItem('token'))
    }
    return false
  })
  const [isActingAs, setIsActingAs] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('mainUser')
    }
    return false
  })

  const actingAsUser = isActingAs ? user : null
  useEffect(() => {
    if (hasValidated.current) return
    hasValidated.current = true

    const isLoggedIn =
      typeof window !== 'undefined'
        ? !!(localStorage.getItem('logged_in') || localStorage.getItem('token'))
        : false

    if (!isLoggedIn) {
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
        queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
        queryClient.setQueryData(
          queryKeys.subscriptions.current(),
          initData.subscription?.subscription ?? null
        )
      })
      .catch(error => {
        const isAuthFailure = error instanceof RpcError && error.isAuthError
        if (isAuthFailure) {
          setUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('logged_in')
            localStorage.removeItem('org-storage')
          }
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [queryClient])


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
        localStorage.setItem('token', data.token)
        if (lastUserId && lastUserId !== newUserId) {
          queryClient.clear()
          rpcClearCache()
          localStorage.removeItem('org-storage')
        } else {
          queryClient.invalidateQueries()
        }
        localStorage.setItem('last_user_id', newUserId)
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user)
    },
    [queryClient]
  )

  const logout = useCallback(async () => {
    const auth0Enabled =
      typeof window !== 'undefined' ? localStorage.getItem('auth0_enabled') : null
    if (auth0Enabled === 'true') {
      const apiUrl = envConfig.API_URL
      window.location.href = `${apiUrl}/auth0/logout`
      return
    }
    
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
      localStorage.removeItem('org-storage')
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

  const actAs = useCallback(
    (targetUser: User, targetToken: string) => {
      if (typeof window === 'undefined') return
      const mainUser = {
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: null,
      }
      localStorage.setItem('mainUser', JSON.stringify(mainUser))
      localStorage.setItem('user', JSON.stringify(targetUser))
      localStorage.setItem('token', targetToken)
      setUser(targetUser)
      setIsActingAs(true)
      queryClient.setQueryData(queryKeys.auth.currentUser(), targetUser)
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
      localStorage.removeItem('token')
      localStorage.removeItem('mainUser')
      setUser(mainUser.user)
      setIsActingAs(false)
      queryClient.setQueryData(queryKeys.auth.currentUser(), mainUser.user)
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

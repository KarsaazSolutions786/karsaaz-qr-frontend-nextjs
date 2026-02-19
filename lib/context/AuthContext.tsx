'use client'

import React, { createContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'
import { queryKeys } from '@/lib/query/keys'
import { User } from '@/types/entities/user'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
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

  // Validate token on mount by calling GET /myself
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
        const freshUser = response.data.data ?? response.data
        setUser(freshUser as User)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(freshUser))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), freshUser)
      })
      .catch(() => {
        // Token is invalid — clear everything
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

  const login = useCallback(async (email: string, password: string) => {
    // Only send fields the backend accepts (email + password)
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
  }, [queryClient])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout')
    } catch {
      // Ignore — we clear local state regardless
    }
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
    queryClient.setQueryData(queryKeys.auth.currentUser(), null)
    queryClient.clear()
    router.push('/login')
  }, [queryClient, router])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
  }

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  )
}

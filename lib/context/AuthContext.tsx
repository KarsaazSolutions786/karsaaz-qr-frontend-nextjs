'use client'

import React, { createContext, ReactNode, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'
import { queryKeys } from '@/lib/query/keys'
import { User } from '@/types/entities/user'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Store user in state (will be set from login response or localStorage)
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage on mount
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

  const loginMutation = useMutation({
    mutationFn: async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
      const response = await apiClient.post<{ user: User; token: string }>('/login', { 
        email, 
        password,
        remember: rememberMe 
      })
      return response.data
    },
    onSuccess: (data) => {
      // Store user in state and localStorage
      setUser(data.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
      }
      
      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user)
      router.push('/qrcodes')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/logout')
    },
    onSuccess: () => {
      // Clear user from state and localStorage
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      
      queryClient.setQueryData(queryKeys.auth.currentUser(), null)
      queryClient.clear()
      router.push('/login')
    },
  })

  const contextValue: AuthContextType = {
    user,
    isLoading: loginMutation.isPending,
    isAuthenticated: !!user,
    login: async (email, password, rememberMe) => {
      await loginMutation.mutateAsync({ email, password, rememberMe })
    },
    logout: async () => {
      await logoutMutation.mutateAsync()
    },
    setUser,
  }

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  )
}

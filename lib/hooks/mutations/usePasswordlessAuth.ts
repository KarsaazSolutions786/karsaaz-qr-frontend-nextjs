'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  authAPI,
  PasswordlessInitRequest,
  PasswordlessVerifyRequest,
  PasswordlessCheckPreferenceRequest,
  PasswordlessResendRequest,
  PasswordlessSetPreferenceRequest,
} from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'



function getPostLoginRedirect(user: { roles?: Array<{ home_page?: string }> }): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const from = params.get('from')
    if (from && from.startsWith('/') && !from.startsWith('//') && !from.includes('://')) {
      return from
    }
  }
  let homePage = user.roles?.[0]?.home_page
  // Strip legacy /dashboard prefix (old Lit frontend used /dashboard/qrcodes, Next.js uses /qrcodes)
  if (homePage?.startsWith('/dashboard')) {
    homePage = homePage.replace('/dashboard', '')
  }
  if (homePage) return homePage
  return '/qrcodes/new'
}


export function usePasswordlessStatus() {
  return useQuery({
    queryKey: ['passwordless-status'],
    queryFn: () => authAPI.passwordlessStatus(),
    staleTime: 5 * 60 * 1000, // Cache for 5 min
    retry: false,
  })
}


export function usePasswordlessCheckPreference() {
  return useMutation({
    mutationFn: (data: PasswordlessCheckPreferenceRequest) =>
      authAPI.passwordlessCheckPreference(data),
  })
}


export function usePasswordlessInit() {
  return useMutation({
    mutationFn: (data: PasswordlessInitRequest) => authAPI.passwordlessInit(data),
  })
}


export function usePasswordlessVerify() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: PasswordlessVerifyRequest) => authAPI.passwordlessVerify(data),
    onSuccess: response => {
      // Store user in AuthContext and localStorage (same as traditional login)
      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        // Token is stored in httpOnly cookie by backend
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', response.token)
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)

      // Redirect to dashboard
      router.push(getPostLoginRedirect(response.user))
    },
  })
}


export function usePasswordlessResend() {
  return useMutation({
    mutationFn: (data: PasswordlessResendRequest) => authAPI.passwordlessResend(data),
  })
}


export function usePasswordlessGetPreference() {
  return useQuery({
    queryKey: ['passwordless-preference'],
    queryFn: () => authAPI.passwordlessGetPreference(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}


export function usePasswordlessSetPreference() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PasswordlessSetPreferenceRequest) => authAPI.passwordlessSetPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwordless-preference'] })
    },
  })
}

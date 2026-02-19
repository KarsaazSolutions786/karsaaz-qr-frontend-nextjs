'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  authAPI,
  PasswordlessInitRequest,
  PasswordlessVerifyRequest,
  PasswordlessCheckPreferenceRequest,
  PasswordlessResendRequest,
} from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

/** Determine where to send the user after login */
function getPostLoginRedirect(user: { roles?: Array<{ home_page?: string }> }): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const from = params.get('from')
    if (from) return from
  }
  const homePage = user.roles?.[0]?.home_page
  if (homePage) return homePage
  return '/qrcodes'
}

/**
 * Query to check if passwordless auth is enabled globally.
 * Matches original: LoginTypeSelector.fetchPasswordlessStatus()
 */
export function usePasswordlessStatus() {
  return useQuery({
    queryKey: ['passwordless-status'],
    queryFn: () => authAPI.passwordlessStatus(),
    staleTime: 5 * 60 * 1000, // Cache for 5 min
    retry: false,
  })
}

/**
 * Mutation to check per-user login preference.
 * Matches original: post('passwordless-auth/check-preference', { email })
 * Returns { login_method: 'passwordless' | 'traditional' }
 */
export function usePasswordlessCheckPreference() {
  return useMutation({
    mutationFn: (data: PasswordlessCheckPreferenceRequest) =>
      authAPI.passwordlessCheckPreference(data),
  })
}

/**
 * Mutation to initialize OTP — sends 5-digit code to email.
 * Matches original: post('passwordless-auth/init', { email })
 */
export function usePasswordlessInit() {
  return useMutation({
    mutationFn: (data: PasswordlessInitRequest) => authAPI.passwordlessInit(data),
  })
}

/**
 * Mutation to verify OTP and authenticate.
 * Matches original: post('passwordless-auth/verify', { email, otp })
 * On success: stores token + user, redirects to dashboard.
 */
export function usePasswordlessVerify() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: PasswordlessVerifyRequest) => authAPI.passwordlessVerify(data),
    onSuccess: (response) => {
      // Store user in AuthContext and localStorage (same as traditional login)
      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)

      // Redirect to dashboard
      router.push(getPostLoginRedirect(response.user))
    },
  })
}

/**
 * Mutation to resend OTP code.
 * Matches original: post('passwordless-auth/resend', { email })
 */
export function usePasswordlessResend() {
  return useMutation({
    mutationFn: (data: PasswordlessResendRequest) => authAPI.passwordlessResend(data),
  })
}

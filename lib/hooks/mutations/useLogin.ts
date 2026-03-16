'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, LoginResponse } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { LoginFormData } from '@/lib/validations/auth'

/** Determine where to send the user after login */
function getPostLoginRedirect(user: { roles?: Array<{ home_page?: string }> }): string {
  // Check for ?from= query parameter first
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const from = params.get('from')
    if (from && from.startsWith('/') && !from.startsWith('//') && !from.includes('://')) {
      return from
    }
  }
  // Use the home_page from user's first role (matches original frontend)
  let homePage = user.roles?.[0]?.home_page
  // Strip legacy /dashboard prefix (old Lit frontend used /dashboard/qrcodes, Next.js uses /qrcodes)
  if (homePage?.startsWith('/dashboard')) {
    homePage = homePage.replace('/dashboard', '')
  }
  if (homePage) return homePage
  // Default fallback
  return '/qrcodes/new'
}

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginFormData) => {
      // Only send fields the backend expects (email + password)
      return authAPI.login({
        email: data.email,
        password: data.password,
      })
    },
    onSuccess: response => {
      // Check if 2FA is required — don't redirect, the component will show the 2FA step
      if ('requires_2fa' in response && response.requires_2fa) {
        // The two_factor_token is available via mutation.data
        return
      }

      // Normal login success (no 2FA)
      const loginResponse = response as LoginResponse
      setUser(loginResponse.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(loginResponse.user))
        // Token is now stored in an httpOnly cookie by the backend.
        // Store only a flag for client-side session detection.
        localStorage.setItem('logged_in', 'true')
        localStorage.removeItem('token') // Clean up legacy token
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), loginResponse.user)

      // Check if email is verified — if not, redirect to verification
      if (loginResponse.user.email_verified_at === null) {
        router.push(`/verify-email?email=${encodeURIComponent(loginResponse.user.email)}`)
        return
      }

      router.push(getPostLoginRedirect(loginResponse.user))
    },
  })
}

export function useTwoFactorLoginVerify() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: { two_factor_token: string; code: string }) => {
      return authAPI.twoFactorLoginVerify(data)
    },
    onSuccess: response => {
      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        // Token is stored in httpOnly cookie by backend
        localStorage.setItem('logged_in', 'true')
        localStorage.removeItem('token')
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)

      if (response.user.email_verified_at === null) {
        router.push(`/verify-email?email=${encodeURIComponent(response.user.email)}`)
        return
      }

      router.push(getPostLoginRedirect(response.user))
    },
  })
}

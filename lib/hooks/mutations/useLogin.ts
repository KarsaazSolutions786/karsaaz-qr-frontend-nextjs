'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, LoginResponse } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import { LoginFormData } from '@/lib/validations/auth'
import { toast } from 'sonner'
import { rpcClearCache } from '@/lib/api/rpc'


export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginFormData) => {
      // Include guest session token if present (for guest→user data migration)
      const guestToken =
        typeof window !== 'undefined' ? localStorage.getItem('guest_session_token') : null
      return authAPI.login({
        email: data.email,
        password: data.password,
        ...(guestToken ? { guest_session_token: guestToken } : {}),
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
      const lastUserId = typeof window !== 'undefined' ? localStorage.getItem('last_user_id') : null
      const newUserId = String(loginResponse.user.id)

      setUser(loginResponse.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(loginResponse.user))
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', loginResponse.token)

        // Smart Cache Clear: Only clear if switching users to preserve performance
        if (lastUserId && lastUserId !== newUserId) {
          queryClient.clear()
          rpcClearCache()
        } else {
          // If same user, trigger background invalidation
          // to ensure latest data is fetched while showing cache instantly.
          queryClient.invalidateQueries()
        }
        localStorage.setItem('last_user_id', newUserId)

        localStorage.removeItem('guest_session_token') // Clear guest session after login
        localStorage.removeItem('guest_action_count')
      }

      // Show toast if guest QR codes were migrated to the new account
      if (loginResponse.guest_migration?.migrated_qrcodes) {
        toast.success(
          `${loginResponse.guest_migration.migrated_qrcodes} QR code(s) migrated to your account!`
        )
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), loginResponse.user)

      // Check if email is verified — if not, redirect to verification
      if (loginResponse.user.email_verified_at === null) {
        router.push(`/verify-email?email=${encodeURIComponent(loginResponse.user.email)}`)
        return
      }

      // Check for returnUrl or next in the URL
      const searchParams = new URLSearchParams(window.location.search)
      const next = searchParams.get('returnUrl') || searchParams.get('next')
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
      
      router.push(safeNext || '/dashboard')
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
      const lastUserId = typeof window !== 'undefined' ? localStorage.getItem('last_user_id') : null
      const newUserId = String(response.user.id)

      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', response.token)

        // Smart Cache Clear: Only clear if switching users to preserve performance
        if (lastUserId && lastUserId !== newUserId) {
          queryClient.clear()
          rpcClearCache()
        } else {
          // If same user, trigger background invalidation
          // to ensure latest data is fetched while showing cache instantly.
          queryClient.invalidateQueries()
        }
        localStorage.setItem('last_user_id', newUserId)

        localStorage.removeItem('guest_session_token')
        localStorage.removeItem('guest_action_count')
      }
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)

      if (response.user.email_verified_at === null) {
        router.push(`/verify-email?email=${encodeURIComponent(response.user.email)}`)
        return
      }

      router.push('/dashboard')
    },
  })
}

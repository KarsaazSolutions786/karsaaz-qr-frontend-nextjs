'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { authAPI, VerifyOTPRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

export function useVerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authAPI.verifyOTP(data),
    onSuccess: response => {
      // Store the verified user and token
      if (response.user) {
        setUser(response.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      }
      if (response.token && typeof window !== 'undefined') {
        // Token is stored in httpOnly cookie by backend
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('token', response.token)
      }

      // ?next=... overrides the default role home_page -- used by the combined
      // org-signup flow to land the new owner on /organization instead. Only a
      // same-origin relative path is accepted (single leading "/", not "//" or an
      // absolute URL) to avoid an open-redirect via a client-controlled query param.
      const next = searchParams?.get('next')
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
      let homePage = safeNext || response.user?.roles?.[0]?.home_page || '/qrcodes/new'
      if (homePage.startsWith('/dashboard')) {
        homePage = homePage.replace('/dashboard', '')
      }
      router.push(homePage)
    },
  })
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendOTP(email),
  })
}

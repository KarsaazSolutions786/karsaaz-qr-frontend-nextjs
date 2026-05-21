'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, VerifyOTPRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Purpose: Executes useVerifyOTP functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useVerifyOTP() {
  const router = useRouter()
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
        localStorage.removeItem('token') // Clean up legacy token
      }

      // Redirect based on user's role home_page
      let homePage = response.user?.roles?.[0]?.home_page || '/qrcodes/new'
      if (homePage.startsWith('/dashboard')) {
        homePage = homePage.replace('/dashboard', '')
      }
      router.push(homePage)
    },
  })
}

/**
 * Purpose: Executes useResendOTP functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendOTP(email),
  })
}

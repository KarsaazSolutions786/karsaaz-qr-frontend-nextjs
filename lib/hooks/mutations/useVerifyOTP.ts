'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, VerifyOTPRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

export function useVerifyOTP() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authAPI.verifyOTP(data),
    onSuccess: (response) => {
      // Store the verified user and token
      if (response.user) {
        setUser(response.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      }
      if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token)
      }

      // Redirect based on user's role home_page
      const homePage = response.user?.roles?.[0]?.home_page
      router.push(homePage || '/qrcodes')
    },
  })
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendOTP(email),
  })
}

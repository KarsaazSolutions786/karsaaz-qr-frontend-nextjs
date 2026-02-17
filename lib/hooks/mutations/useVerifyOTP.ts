'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, VerifyOTPRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

export function useVerifyOTP() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authAPI.verifyOTP(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      router.push('/dashboard')
    },
  })
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authAPI.resendOTP(email),
  })
}

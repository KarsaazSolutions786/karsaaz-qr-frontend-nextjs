'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, ResetPasswordRequest } from '@/lib/api/endpoints/auth'

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authAPI.resetPassword(data),
    onSuccess: () => {
      router.push('/auth/login?message=password-reset-success')
    },
  })
}

'use client'

import { useMutation } from '@tanstack/react-query'
import { authAPI, ForgotPasswordRequest } from '@/lib/api/endpoints/auth'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
  })
}

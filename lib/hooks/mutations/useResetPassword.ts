'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import type { ResetPasswordFormData } from '@/lib/validations/auth'

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authAPI.resetPassword({
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      }),
    onSuccess: () => {
      router.push('/login?message=password-reset-success')
    },
  })
}

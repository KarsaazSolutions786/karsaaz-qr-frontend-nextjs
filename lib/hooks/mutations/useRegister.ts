'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'
import type { RegisterFormData } from '@/lib/validations/auth'

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        terms_consent: data.termsConsent,
      }),
    onSuccess: (response, variables) => {
      // Store token + user immediately (even before email verification)
      if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.token)
      }
      if (response.user) {
        setUser(response.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      }

      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`)
    },
  })
}

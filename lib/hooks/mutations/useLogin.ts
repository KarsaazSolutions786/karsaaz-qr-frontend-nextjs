'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, LoginRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      // Store user in AuthContext and localStorage
      setUser(response.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('token', response.token)
      }

      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      
      // Check for redirect query parameter
      const params = new URLSearchParams(window.location.search)
      const from = params.get('from')
      
      router.push(from || '/qrcodes')
    },
  })
}

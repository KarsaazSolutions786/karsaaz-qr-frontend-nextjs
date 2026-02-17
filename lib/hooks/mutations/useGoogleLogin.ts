'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, GoogleLoginRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

export function useGoogleLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => authAPI.googleLogin(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      
      const params = new URLSearchParams(window.location.search)
      const from = params.get('from')
      
      router.push(from || '/dashboard')
    },
  })
}

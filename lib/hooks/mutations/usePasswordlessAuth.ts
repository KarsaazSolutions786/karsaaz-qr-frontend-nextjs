'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  authAPI,
  PasswordlessInitRequest,
  PasswordlessVerifyRequest,
} from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

export function usePasswordlessInit() {
  return useMutation({
    mutationFn: (data: PasswordlessInitRequest) => authAPI.passwordlessInit(data),
  })
}

export function usePasswordlessVerify() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PasswordlessVerifyRequest) => authAPI.passwordlessVerify(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      
      const params = new URLSearchParams(window.location.search)
      const from = params.get('from')
      
      router.push(from || '/dashboard')
    },
  })
}

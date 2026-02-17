'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAPI, RegisterRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      router.push('/auth/verify-email')
    },
  })
}

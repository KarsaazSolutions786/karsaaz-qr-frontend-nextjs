'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI, UpdateProfileRequest } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

/**
 * Purpose: Executes useUpdateProfile functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authAPI.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() })
    },
  })
}

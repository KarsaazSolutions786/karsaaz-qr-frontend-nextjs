'use client'

import { useQuery } from '@tanstack/react-query'
import { authAPI } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/query/keys'

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: async () => {
      try {
        return await authAPI.getCurrentUser()
      } catch (error) {
        if ((error as any).response?.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { rpc, RpcError } from '@/lib/api/rpc'
import { queryKeys } from '@/lib/query/keys'
import type { User } from '@/types/entities/user'

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: async ({ signal }) => {
      try {
        return await rpc<User>('user.profile', {}, { skipDedup: true, signal })
      } catch (error) {
        if (error instanceof RpcError && error.isAuthError) {
          return null
        }
        throw error
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

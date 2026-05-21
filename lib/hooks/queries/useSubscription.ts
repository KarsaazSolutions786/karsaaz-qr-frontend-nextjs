import { useQuery } from '@tanstack/react-query'
import { rpc, RpcError } from '@/lib/api/rpc'
import { queryKeys } from '@/lib/query/keys'
import type { Subscription } from '@/types/entities/subscription'

/**
 * Purpose: Executes useSubscription functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useSubscription() {
  return useQuery<Subscription | null>({
    queryKey: queryKeys.subscriptions.current(),
    queryFn: async ({ signal }) => {
      try {
        const result = await rpc<{ subscription: Subscription | null; plan: Record<string, unknown> | null }>(
          'billing.subscription',
          {},
          { skipDedup: true, signal }
        )
        return result.subscription
      } catch (error) {
        if (error instanceof RpcError && (error.isAuthError || error.isNotFound)) {
          return null
        }
        throw error
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof RpcError && error.isNotFound) return false
      return failureCount < 2
    },
  })
}

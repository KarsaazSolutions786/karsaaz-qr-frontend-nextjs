import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscriptions.current(),
    queryFn: async () => {
      try {
        const response = await getSubscription()
        return response.data
      } catch (error) {
        // If user has no subscription, return null instead of error
        if ((error as any).response?.status === 404) {
          return null
        }
        throw error
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry 404s
      if ((error as any).response?.status === 404) return false
      return failureCount < 2
    },
  })
}

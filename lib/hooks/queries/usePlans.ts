import { useQuery } from '@tanstack/react-query'
import { getPlans } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans(),
    queryFn: async () => {
      const response = await getPlans()
      return response.data
    },
    staleTime: 10 * 60 * 1000, // Plans don't change often, cache for 10 minutes
  })
}

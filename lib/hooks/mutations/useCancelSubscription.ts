import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelSubscription } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await cancelSubscription()
      return response.data
    },
    onSuccess: () => {
      // Invalidate subscription queries to update status
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all() })
    },
    onError: (error: unknown) => {
      if (process.env.NODE_ENV === 'development') console.error('Cancel subscription error:', error)
    },
  })
}

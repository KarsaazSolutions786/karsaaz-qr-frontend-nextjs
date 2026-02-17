import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscribe, SubscribeRequest } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'
import { useRouter } from 'next/navigation'

export function useSubscribe() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: SubscribeRequest) => {
      const response = await subscribe(data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate subscription queries to fetch the new subscription
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all() })
      
      // If 3D Secure is required, clientSecret will be present
      if (data.clientSecret) {
        // Handle 3D Secure flow (would integrate with Stripe Elements)
        console.log('3D Secure required:', data.clientSecret)
      } else {
        // Subscription successful, redirect to dashboard
        router.push('/subscriptions')
      }
    },
    onError: (error: any) => {
      console.error('Subscribe error:', error)
    },
  })
}

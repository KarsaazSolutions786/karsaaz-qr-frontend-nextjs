import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscribe, SubscribeRequest, generatePayLink } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'



export function useSubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubscribeRequest) => {
      const response = await subscribe(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all() })
    },
    onError: (error: unknown) => {
      if (process.env.NODE_ENV === 'development') console.error('Subscribe error:', error)
    },
  })
}


export function useCheckout() {
  return useMutation({
    mutationFn: async ({
      planId,
      processorSlug,
      promoCodeData,
      billingDetailsResponseId,
      isChangePlan = false,
    }: {
      planId: number | string
      processorSlug: string
      promoCodeData?: SubscribeRequest['promo_code_data']
      billingDetailsResponseId?: string | null
      isChangePlan?: boolean
    }) => {
      // Build request data
      const data: Record<string, unknown> = {}

      if (billingDetailsResponseId) {
        data.billingDetailsResponseId = billingDetailsResponseId
      }

      if (promoCodeData) {
        data.promo_code_data = promoCodeData
      }
      const result = await generatePayLink(processorSlug, planId, data, isChangePlan)
      return result.link
    },
    onSuccess: (redirectUrl) => {
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    },
    onError: (error: unknown) => {
      if (process.env.NODE_ENV === 'development') console.error('Checkout error:', error)
    },
  })
}

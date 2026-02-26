import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subscribe, SubscribeRequest, generatePayLink } from '@/lib/api/endpoints/subscriptions'
import { queryKeys } from '@/lib/query/keys'

/**
 * Create a subscription record on the backend.
 * Returns the subscription object with id.
 */
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
    onError: (error: any) => {
      console.error('Subscribe error:', error)
    },
  })
}

/**
 * Generate a payment link and redirect the browser.
 *
 * Flow (matching Lit reference qrcg-pay-button.js):
 * - Call generate-pay-link for ALL processors
 * - Backend handles subscription creation during payment processing
 */
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
      const data: Record<string, any> = {}

      if (billingDetailsResponseId) {
        data.billingDetailsResponseId = billingDetailsResponseId
      }

      if (promoCodeData) {
        data.promo_code_data = promoCodeData
      }

      // Call generate-pay-link for all processors
      // Backend handles subscription creation during payment verification
      const result = await generatePayLink(processorSlug, planId, data, isChangePlan)
      return result.link
    },
    onSuccess: (redirectUrl) => {
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    },
    onError: (error: any) => {
      console.error('Checkout error:', error)
    },
  })
}

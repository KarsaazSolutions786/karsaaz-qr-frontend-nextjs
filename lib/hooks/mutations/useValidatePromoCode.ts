import { useMutation } from '@tanstack/react-query'
import { validatePromoCode, ValidatePromoCodeRequest } from '@/lib/api/endpoints/subscriptions'

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async (data: ValidatePromoCodeRequest) => {
      const response = await validatePromoCode(data)
      return response.data
    },
    onError: (error: unknown) => {
      if (process.env.NODE_ENV === 'development') console.error('Validate promo code error:', error)
    },
  })
}

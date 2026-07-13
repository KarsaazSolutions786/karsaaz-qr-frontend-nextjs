import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePaymentMethod } from '@/lib/api/endpoints/stripe'
import { queryKeys } from '@/lib/query/keys'


export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentMethodId: string) => updatePaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.paymentMethods() })
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.all() })
    },
  })
}

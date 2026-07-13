import { useQuery } from '@tanstack/react-query'
import { billingCollectionAPI } from '@/lib/api/endpoints/billing-collection'


/**
 * Purpose: Check if billing details collection is enabled for checkout.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function useBillingCollectionEnabled() {
  return useQuery({
    queryKey: ['billing-collection', 'is-enabled'],
    queryFn: () => billingCollectionAPI.isEnabled(),
    staleTime: 60_000,
  })
}



export function useBillingCollectionForm(
  customerType: string | null,
  billingEnabled: boolean
) {
  return useQuery({
    queryKey: ['billing-collection', 'form', customerType],
    queryFn: () => billingCollectionAPI.getForm(customerType!),
    enabled: billingEnabled && !!customerType,
    staleTime: 60_000,
  })
}

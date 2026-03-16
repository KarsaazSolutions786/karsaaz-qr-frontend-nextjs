import { useQuery } from '@tanstack/react-query'
import { billingCollectionAPI } from '@/lib/api/endpoints/billing-collection'

/**
 * Check if billing details collection is enabled for checkout.
 */
export function useBillingCollectionEnabled() {
  return useQuery({
    queryKey: ['billing-collection', 'is-enabled'],
    queryFn: () => billingCollectionAPI.isEnabled(),
    staleTime: 60_000,
  })
}

/**
 * Fetch the custom form ID for a given customer type ('private' | 'company').
 * Enabled only when billingEnabled is true and customerType is provided.
 */
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

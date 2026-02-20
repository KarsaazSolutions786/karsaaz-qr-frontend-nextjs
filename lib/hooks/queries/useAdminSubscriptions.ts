import { useQuery } from '@tanstack/react-query'
import { adminSubscriptionsAPI } from '@/lib/api/endpoints/admin-subscriptions'
import { queryKeys } from '@/lib/query/keys'

export function useAdminSubscriptions(params?: { page?: number; keyword?: string }) {
  return useQuery({
    queryKey: queryKeys.adminSubscriptions.list(params),
    queryFn: () => adminSubscriptionsAPI.getAll(params),
    staleTime: 30000,
  })
}

export function useAdminSubscription(id: number) {
  return useQuery({
    queryKey: queryKeys.adminSubscriptions.detail(id),
    queryFn: () => adminSubscriptionsAPI.getById(id),
    enabled: id > 0,
  })
}

export function useSubscriptionStatuses() {
  return useQuery({
    queryKey: queryKeys.adminSubscriptions.statuses(),
    queryFn: () => adminSubscriptionsAPI.getStatuses(),
    staleTime: 5 * 60 * 1000,
  })
}

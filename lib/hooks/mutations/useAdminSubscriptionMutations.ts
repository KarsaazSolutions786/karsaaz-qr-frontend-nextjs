import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { adminSubscriptionsAPI, CreateAdminSubscriptionRequest } from '@/lib/api/endpoints/admin-subscriptions'
import { queryKeys } from '@/lib/query/keys'

export function useCreateAdminSubscription() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAdminSubscriptionRequest) => adminSubscriptionsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSubscriptions.all() })
      router.push('/subscriptions')
    },
  })
}

export function useUpdateAdminSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAdminSubscriptionRequest> }) =>
      adminSubscriptionsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSubscriptions.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSubscriptions.detail(variables.id) })
    },
  })
}

export function useDeletePendingSubscriptions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => adminSubscriptionsAPI.deletePending(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSubscriptions.all() })
    },
  })
}

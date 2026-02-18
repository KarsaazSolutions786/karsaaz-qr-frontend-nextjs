import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { plansAPI } from '@/lib/api/endpoints/plans'
import { queryKeys } from '@/lib/query/keys'
import type { CreateSubscriptionPlanRequest } from '@/types/entities/plan'

export function useCreatePlan() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSubscriptionPlanRequest) => plansAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
      router.push('/plans')
    },
  })
}

export function useUpdatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSubscriptionPlanRequest> }) =>
      plansAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.detail(variables.id) })
    },
  })
}

export function useDeletePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => plansAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
    },
  })
}

export function useDuplicatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => plansAPI.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
    },
  })
}

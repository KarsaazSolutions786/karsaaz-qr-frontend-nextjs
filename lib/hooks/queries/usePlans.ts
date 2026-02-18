import { useQuery } from '@tanstack/react-query'
import { plansAPI } from '@/lib/api/endpoints/plans'
import { queryKeys } from '@/lib/query/keys'

// Get all plans
export function usePlans(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.plans.list(params),
    queryFn: () => plansAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single plan
export function usePlan(id: number) {
  return useQuery({
    queryKey: queryKeys.plans.detail(id),
    queryFn: () => plansAPI.getById(id),
    enabled: !!id,
  })
}

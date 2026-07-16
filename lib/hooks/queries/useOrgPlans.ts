import { useQuery } from '@tanstack/react-query'
import { orgPlanAPI } from '@/lib/api/endpoints/organization'

/** Public shared org-plan catalog -- GET /api/org-plans is unauthenticated-safe. */
export function useOrgPlans() {
  return useQuery({
    queryKey: ['org-plans', 'public-catalog'],
    queryFn: () => orgPlanAPI.list(),
    staleTime: 30000,
  })
}

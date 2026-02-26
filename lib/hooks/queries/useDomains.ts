import { useQuery } from '@tanstack/react-query'
import { domainsAPI } from '@/lib/api/endpoints/domains'
import { queryKeys } from '@/lib/query/keys'

export function useDomains(
  params?: { page?: number; search?: string },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.domains.list(),
    queryFn: () => domainsAPI.list(params),
    staleTime: 30000,
    enabled: options?.enabled ?? true,
  })
}

export function useDomain(id: string) {
  return useQuery({
    queryKey: queryKeys.domains.detail(id),
    queryFn: () => domainsAPI.getById(id),
    enabled: !!id,
  })
}

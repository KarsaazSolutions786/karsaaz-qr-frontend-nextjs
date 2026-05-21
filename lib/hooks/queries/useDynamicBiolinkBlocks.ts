import { useQuery } from '@tanstack/react-query'
import { dynamicBiolinkBlocksAPI } from '@/lib/api/endpoints/dynamic-biolink-blocks'
import { queryKeys } from '@/lib/query/keys'

/**
 * Purpose: Executes useDynamicBiolinkBlocks functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDynamicBiolinkBlocks(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.dynamicBiolinkBlocks.list(params),
    queryFn: () => dynamicBiolinkBlocksAPI.getAll(params),
    staleTime: 30000,
  })
}

/**
 * Purpose: Executes useDynamicBiolinkBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDynamicBiolinkBlock(id: number) {
  return useQuery({
    queryKey: queryKeys.dynamicBiolinkBlocks.detail(id),
    queryFn: () => dynamicBiolinkBlocksAPI.getById(id),
    enabled: !!id,
  })
}

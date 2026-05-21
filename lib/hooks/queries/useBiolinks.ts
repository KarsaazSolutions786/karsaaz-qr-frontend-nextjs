import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { biolinksAPI } from '@/lib/api/endpoints/biolinks'
import { queryKeys } from '@/lib/query/keys'
import type { Biolink } from '@/types/entities/biolink'

/**
 * Purpose: Executes useBiolinks functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBiolinks(params?: {
  page?: number
  perPage?: number
  search?: string
}) {
  return useQuery({
    queryKey: queryKeys.biolinks.list(params),
    queryFn: () => biolinksAPI.getAll(params),
  })
}

/**
 * Purpose: Executes useBiolink functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBiolink(
  id: number,
  options?: Omit<UseQueryOptions<Biolink>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.biolinks.detail(id),
    queryFn: () => biolinksAPI.getById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Purpose: Executes useBiolinkBySlug functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBiolinkBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.biolinks.bySlug(slug),
    queryFn: () => biolinksAPI.getBySlug(slug),
    enabled: !!slug,
  })
}

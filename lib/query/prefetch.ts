import { useCallback } from 'react'
import { useQueryClient, type QueryKey, type QueryFunction } from '@tanstack/react-query'

/**
 * Purpose: Returns an onMouseEnter handler that prefetches data on hover. Useful for links/buttons where users are likely to navigate next.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function prefetchOnHover<T>(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  staleTime = 30_000
) {
  return () => {
    queryClient.prefetchQuery({ queryKey, queryFn, staleTime })
  }
}

/**
 * Purpose: Hook version of prefetchOnHover. Returns { onMouseEnter } props to spread on a hoverable element. const prefetch = usePrefetchOnHover(queryKeys.qrcodes.detail(id), () => fetchQR(id)) <Link {...prefetch} href={`/qrcodes/${id}`}>View</Link>
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function usePrefetchOnHover<T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  staleTime = 30_000
) {
  const queryClient = useQueryClient()

  const onMouseEnter = useCallback(() => {
    queryClient.prefetchQuery({ queryKey, queryFn, staleTime })
  }, [queryClient, queryKey, queryFn, staleTime])

  return { onMouseEnter }
}

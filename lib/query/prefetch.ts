import { useCallback } from 'react'
import { useQueryClient, type QueryKey, type QueryFunction } from '@tanstack/react-query'

/**
 * Returns an onMouseEnter handler that prefetches data on hover.
 * Useful for links/buttons where users are likely to navigate next.
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
 * Hook version of prefetchOnHover.
 * Returns { onMouseEnter } props to spread on a hoverable element.
 *
 * @example
 * const prefetch = usePrefetchOnHover(queryKeys.qrcodes.detail(id), () => fetchQR(id))
 * <Link {...prefetch} href={`/qrcodes/${id}`}>View</Link>
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

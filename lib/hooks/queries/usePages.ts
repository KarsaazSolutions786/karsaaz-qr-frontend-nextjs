import { useQuery } from '@tanstack/react-query'
import { pagesAPI } from '@/lib/api/endpoints/pages'
import { queryKeys } from '@/lib/query/keys'

// Get all pages
export function usePages(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.pages.list(params),
    queryFn: () => pagesAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single page
export function usePage(id: number) {
  return useQuery({
    queryKey: queryKeys.pages.detail(id),
    queryFn: () => pagesAPI.getById(id),
    enabled: !!id,
  })
}

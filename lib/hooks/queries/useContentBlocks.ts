import { useQuery } from '@tanstack/react-query'
import { contentBlocksAPI } from '@/lib/api/endpoints/content-blocks'
import { queryKeys } from '@/lib/query/keys'

// Get all content blocks
export function useContentBlocks(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.contentBlocks.list(params),
    queryFn: () => contentBlocksAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single content block
export function useContentBlock(id: number) {
  return useQuery({
    queryKey: queryKeys.contentBlocks.detail(id),
    queryFn: () => contentBlocksAPI.getById(id),
    enabled: !!id,
  })
}

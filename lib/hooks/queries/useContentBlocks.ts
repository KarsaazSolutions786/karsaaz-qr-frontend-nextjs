import { useQuery } from '@tanstack/react-query'
import { contentBlocksAPI } from '@/lib/api/endpoints/content-blocks'
import { queryKeys } from '@/lib/query/keys'

// Get all content blocks
export function useContentBlocks(params?: { page?: number; search?: string; translationId?: number }) {
  const apiParams = params ? {
    page: params.page,
    search: params.search,
    translation_id: params.translationId,
  } : undefined
  return useQuery({
    queryKey: queryKeys.contentBlocks.list(params),
    queryFn: () => contentBlocksAPI.getAll(apiParams),
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

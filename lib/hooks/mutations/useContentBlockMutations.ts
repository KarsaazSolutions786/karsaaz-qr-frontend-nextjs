import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { contentBlocksAPI } from '@/lib/api/endpoints/content-blocks'
import { queryKeys } from '@/lib/query/keys'
import type { CreateContentBlockRequest } from '@/types/entities/content-block'

/**
 * Purpose: Executes useCreateContentBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateContentBlock() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContentBlockRequest) => contentBlocksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
      router.push('/content-blocks')
    },
  })
}

/**
 * Purpose: Executes useUpdateContentBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateContentBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateContentBlockRequest> }) =>
      contentBlocksAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.detail(variables.id) })
    },
  })
}

/**
 * Purpose: Executes useDeleteContentBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteContentBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => contentBlocksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
    },
  })
}

/**
 * Purpose: Executes useDeleteContentBlocksByTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteContentBlocksByTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (translationId: number) => contentBlocksAPI.deleteByTranslation(translationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
    },
  })
}

/**
 * Purpose: Executes useCopyContentBlocks functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCopyContentBlocks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceId, destinationId }: { sourceId: number; destinationId: number }) =>
      contentBlocksAPI.copyBlocks(sourceId, destinationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
    },
  })
}

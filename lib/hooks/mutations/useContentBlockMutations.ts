import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { contentBlocksAPI } from '@/lib/api/endpoints/content-blocks'
import { queryKeys } from '@/lib/query/keys'
import type { CreateContentBlockRequest } from '@/types/entities/content-block'

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

export function useDeleteContentBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => contentBlocksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentBlocks.all() })
    },
  })
}

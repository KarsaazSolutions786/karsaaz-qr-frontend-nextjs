import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { dynamicBiolinkBlocksAPI } from '@/lib/api/endpoints/dynamic-biolink-blocks'
import { queryKeys } from '@/lib/query/keys'
import type { CreateDynamicBiolinkBlockRequest } from '@/types/entities/dynamic-biolink-block'

export function useCreateDynamicBiolinkBlock() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDynamicBiolinkBlockRequest) =>
      dynamicBiolinkBlocksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dynamicBiolinkBlocks.all() })
      router.push('/dynamic-biolink-blocks')
    },
  })
}

export function useUpdateDynamicBiolinkBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateDynamicBiolinkBlockRequest> }) =>
      dynamicBiolinkBlocksAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dynamicBiolinkBlocks.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dynamicBiolinkBlocks.detail(variables.id) })
    },
  })
}

export function useDeleteDynamicBiolinkBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dynamicBiolinkBlocksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dynamicBiolinkBlocks.all() })
    },
  })
}

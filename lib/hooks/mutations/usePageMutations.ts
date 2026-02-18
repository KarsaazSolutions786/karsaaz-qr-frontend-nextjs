import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { pagesAPI } from '@/lib/api/endpoints/pages'
import { queryKeys } from '@/lib/query/keys'
import type { CreatePageRequest } from '@/types/entities/page'

export function useCreatePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePageRequest) => pagesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.all() })
      router.push('/pages')
    },
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePageRequest> }) =>
      pagesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.detail(variables.id) })
    },
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pagesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.all() })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { pagesAPI } from '@/lib/api/endpoints/pages'
import { queryKeys } from '@/lib/query/keys'
import type { CreatePageRequest } from '@/types/entities/page'

/**
 * Purpose: Executes useCreatePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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

/**
 * Purpose: Executes useUpdatePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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

/**
 * Purpose: Executes useDeletePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeletePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pagesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.all() })
    },
  })
}

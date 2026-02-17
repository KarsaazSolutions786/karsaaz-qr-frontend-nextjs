import { useMutation, useQueryClient } from '@tanstack/react-query'
import { biolinksAPI } from '@/lib/api/endpoints/biolinks'
import { queryKeys } from '@/lib/query/keys'
import type { CreateBiolinkRequest, UpdateBiolinkRequest } from '@/types/entities/biolink'

export function useCreateBiolink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBiolinkRequest) => biolinksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.all })
    },
  })
}

export function useUpdateBiolink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBiolinkRequest) => biolinksAPI.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.all })
    },
  })
}

export function useDeleteBiolink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => biolinksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.all })
    },
  })
}

export function useToggleBiolinkPublish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      biolinksAPI.togglePublish(id, isPublished),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.biolinks.all })
    },
  })
}

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

export function useFolders() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.folders.all(),
    queryFn: () => foldersAPI.listByUser(user?.id ?? 0),
    staleTime: 60 * 1000,
    enabled: !!user?.id,
  })
}

export function useCreateFolder() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { folder_name: string }) => foldersAPI.create(user?.id ?? 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
    },
  })
}

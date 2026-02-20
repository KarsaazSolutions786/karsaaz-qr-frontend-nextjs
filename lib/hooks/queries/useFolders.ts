'use client'

import { useQuery } from '@tanstack/react-query'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

export function useFolders() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.folders.all(),
    queryFn: () => foldersAPI.listByUser(user!.id),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!user?.id,
  })
}

export function useFolderTree() {
  return useQuery({
    queryKey: queryKeys.folders.tree(),
    queryFn: () => foldersAPI.getTree(),
    staleTime: 60 * 1000,
  })
}

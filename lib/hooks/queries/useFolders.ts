'use client'

import { useQuery } from '@tanstack/react-query'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { queryKeys } from '@/lib/query/keys'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Purpose: Executes useFolders functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useFolders() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.folders.all(),
    queryFn: () => foldersAPI.listByUser(user?.id ?? 0),
    staleTime: 60 * 1000,
    enabled: !!user?.id,
  })
}

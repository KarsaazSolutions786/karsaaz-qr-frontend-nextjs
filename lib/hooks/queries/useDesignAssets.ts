'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { DesignAssetType } from '@/types/entities/design-asset'

export function useAdminDesignAssets(type?: DesignAssetType) {
  return useQuery({
    queryKey: queryKeys.designAssets.list(type),
    queryFn: () => designAssetsAPI.getAll(type),
    staleTime: 60_000,
  })
}

/** Fetches all design assets (all types) for use in the plan features editor. */
export function useAllDesignAssets() {
  return useQuery({
    queryKey: queryKeys.designAssets.list(),
    queryFn: () => designAssetsAPI.getAll(),
    staleTime: 5 * 60_000,
  })
}

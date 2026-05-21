'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { DesignAssetType } from '@/types/entities/design-asset'

/**
 * Purpose: Executes useAdminDesignAssets functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useAdminDesignAssets(type?: DesignAssetType) {
  return useQuery({
    queryKey: queryKeys.designAssets.list(type),
    queryFn: () => designAssetsAPI.getAll(type),
    // 30 min — assets are server-cached 1800s; match that on the client side to
    // avoid redundant refetches when switching between design tabs.
    staleTime: 30 * 60_000,
  })
}

/**
 * Purpose: * Fetches all design assets (all types) for use in the plan features editor. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */

export function useAllDesignAssets() {
  return useQuery({
    queryKey: queryKeys.designAssets.list(),
    queryFn: () => designAssetsAPI.getAll(),
    // 30 min — matches server-side cache TTL (1800s) to avoid redundant round-trips.
    staleTime: 30 * 60_000,
  })
}

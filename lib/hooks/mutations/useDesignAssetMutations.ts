'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { CreateDesignAssetData } from '@/lib/api/endpoints/design-assets'
import type { ReorderItem } from '@/types/entities/design-asset'

const DESIGN_ASSETS_STORAGE_KEY = 'karsaaz_design_assets'

/**
 * Purpose: * Invalidate all design-asset queries and clear the localStorage hydration cache. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function invalidateDesignAssets(qc: ReturnType<typeof useQueryClient>) {
  try {
    localStorage.removeItem(DESIGN_ASSETS_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() })
}

/**
 * Purpose: Executes useCreateDesignAsset functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useCreateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDesignAssetData) => designAssetsAPI.create(data),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

/**
 * Purpose: Executes useUpdateDesignAsset functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useUpdateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateDesignAssetData>) =>
      designAssetsAPI.update(id, data),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

/**
 * Purpose: Executes useDeleteDesignAsset functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useDeleteDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.delete(id),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

/**
 * Purpose: Executes useReorderDesignAssets functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useReorderDesignAssets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (order: ReorderItem[]) => designAssetsAPI.reorder(order),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

/**
 * Purpose: Executes useToggleDesignAsset functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useToggleDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.toggleActive(id),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

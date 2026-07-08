'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { CreateDesignAssetData } from '@/lib/api/endpoints/design-assets'
import type { ReorderItem } from '@/types/entities/design-asset'

const DESIGN_ASSETS_STORAGE_KEY = 'karsaaz_design_assets'


function invalidateDesignAssets(qc: ReturnType<typeof useQueryClient>) {
  try {
    localStorage.removeItem(DESIGN_ASSETS_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() })
}


export function useCreateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDesignAssetData) => designAssetsAPI.create(data),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}


export function useUpdateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateDesignAssetData>) =>
      designAssetsAPI.update(id, data),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}


export function useDeleteDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.delete(id),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

export function useReorderDesignAssets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (order: ReorderItem[]) => designAssetsAPI.reorder(order),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

export function useToggleDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.toggleActive(id),
    onSuccess: () => invalidateDesignAssets(qc),
  })
}

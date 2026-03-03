'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { CreateDesignAssetData } from '@/lib/api/endpoints/design-assets'
import type { ReorderItem } from '@/types/entities/design-asset'

export function useCreateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDesignAssetData) => designAssetsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() }),
  })
}

export function useUpdateDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateDesignAssetData>) =>
      designAssetsAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() }),
  })
}

export function useDeleteDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() }),
  })
}

export function useReorderDesignAssets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (order: ReorderItem[]) => designAssetsAPI.reorder(order),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() }),
  })
}

export function useToggleDesignAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => designAssetsAPI.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.designAssets.all() }),
  })
}

'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { designAssetsAPI } from '@/lib/api/endpoints/design-assets'
import type { DesignAsset } from '@/types/entities/design-asset'
import type { ShapeOption, OutlinedShape, AdvancedShape } from '@/lib/constants/qr-shapes'
import {
  MODULE_SHAPES as FALLBACK_MODULE_SHAPES,
  FINDER_STYLES as FALLBACK_FINDER_STYLES,
  FINDER_DOT_STYLES as FALLBACK_FINDER_DOT_STYLES,
  OUTLINED_SHAPES as FALLBACK_OUTLINED_SHAPES,
  ADVANCED_SHAPES as FALLBACK_ADVANCED_SHAPES,
  PRESET_LOGOS as FALLBACK_PRESET_LOGOS,
} from '@/lib/constants/qr-shapes'
import { resolveBackendUrl } from '@/lib/utils/resolve-backend-url'

const DESIGN_ASSETS_STORAGE_KEY = 'karsaaz_design_assets'
function toShapeOption(asset: DesignAsset): ShapeOption {
  return {
    value: asset.slug,
    label: asset.label,
    image: resolveBackendUrl(asset.thumbnail_url) || undefined,
  }
}
function toOutlinedShape(asset: DesignAsset): OutlinedShape {
  const meta = asset.metadata as Record<string, unknown> | null
  const source = meta?.svg_path ? 'uploaded' : 'built_in'
  const version = (meta?.version as number) ?? 1
  return {
    value: asset.slug,
    label: asset.label,
    image: resolveBackendUrl(asset.thumbnail_url) || undefined,
    id: asset.id,
    version,
    source,
    engine: asset.engine ?? null,
  }
}
function toAdvancedShape(asset: DesignAsset): AdvancedShape {
  const meta = asset.metadata as Record<string, unknown> | null
  // V2 registry columns win; metadata fallback for pre-V2 backends
  const source = asset.source ?? (meta?.svg_path ? 'uploaded' : 'built_in')
  const version = asset.version ?? (meta?.version as number) ?? 1
  const baseImage = resolveBackendUrl(asset.thumbnail_url)
  return {
    value: asset.slug,
    label: asset.label,
    hasText: asset.engine?.capabilities.supportsText ?? (meta?.hasText as boolean) ?? false,
    textLines: asset.engine?.controls.textLines ?? (meta?.textLines as number) ?? 0,
    // Version query busts browser/CDN caches when the template (and its
    // regenerated thumbnail) changes
    image: baseImage ? `${baseImage}${baseImage.includes('?') ? '&' : '?'}v=${version}` : undefined,
    id: asset.id,
    version,
    source,
    checksum: asset.checksum ?? null,
    renderMode: asset.engine?.renderMode ?? (meta?.renderMode as string) ?? 'svg_template',
    engine: asset.engine ?? null,
  }
}

/**
 * Purpose: * Read cached design assets from localStorage (if available).
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getCachedAssets(): DesignAsset[] | null {
  try {
    const raw = localStorage.getItem(DESIGN_ASSETS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DesignAsset[]
  } catch {
    return null
  }
}

/**
 * Purpose: * Persist design assets to localStorage for instant hydration next visit.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function setCachedAssets(assets: DesignAsset[]) {
  try {
    localStorage.setItem(DESIGN_ASSETS_STORAGE_KEY, JSON.stringify(assets))
  } catch {
    // localStorage full — ignore
  }
}

export function useDesignShapes() {
  const { data: allAssets, isLoading } = useQuery({
    queryKey: queryKeys.designAssets.all(),
    queryFn: async () => {
      const assets = await designAssetsAPI.getAll()
      setCachedAssets(assets)
      return assets
    },
    staleTime: 30 * 60_000, // 30 min — matches server-side cache TTL (1800s); admin mutations invalidate this key directly
    gcTime: 60 * 60_000, // 1 hr garbage collection
    initialData: getCachedAssets() ?? undefined,
    initialDataUpdatedAt: 0, // Treat localStorage data as stale — always refetch in background
    retry: 1,
  })

  return useMemo(() => {
    if (!allAssets || allAssets.length === 0) {
      return {
        isLoading,
        MODULE_SHAPES: FALLBACK_MODULE_SHAPES,
        FINDER_STYLES: FALLBACK_FINDER_STYLES,
        FINDER_DOT_STYLES: FALLBACK_FINDER_DOT_STYLES,
        OUTLINED_SHAPES: FALLBACK_OUTLINED_SHAPES,
        ADVANCED_SHAPES: FALLBACK_ADVANCED_SHAPES,
        PRESET_LOGOS: FALLBACK_PRESET_LOGOS,
      }
    }

    const byType = (type: string) =>
      allAssets
        .filter(a => a.type === type && a.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)

    return {
      isLoading,
      MODULE_SHAPES: byType('module_style').map(toShapeOption) as ShapeOption[],
      FINDER_STYLES: byType('finder_outer_style').map(toShapeOption) as ShapeOption[],
      FINDER_DOT_STYLES: byType('finder_dot_style').map(toShapeOption) as ShapeOption[],
      OUTLINED_SHAPES: byType('outline_style').map(toOutlinedShape),
      ADVANCED_SHAPES: byType('advanced_shape').map(toAdvancedShape),
      PRESET_LOGOS: byType('preset_logo').map(toShapeOption),
    }
  }, [allAssets, isLoading])
}

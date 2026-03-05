'use client'

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

function toShapeOption(asset: DesignAsset): ShapeOption {
  return {
    value: asset.slug,
    label: asset.label,
    image: asset.thumbnail_url || undefined,
  }
}

function toOutlinedShape(asset: DesignAsset): OutlinedShape {
  return {
    value: asset.slug,
    label: asset.label,
    image: asset.thumbnail_url || undefined,
  }
}

function toAdvancedShape(asset: DesignAsset): AdvancedShape {
  const meta = asset.metadata as Record<string, unknown> | null
  return {
    value: asset.slug,
    label: asset.label,
    hasText: (meta?.hasText as boolean) ?? false,
    textLines: (meta?.textLines as number) ?? 0,
    image: asset.thumbnail_url || undefined,
  }
}

/**
 * Fetches all active design assets from the DB API and maps them
 * to the same ShapeOption/OutlinedShape/AdvancedShape format used
 * by the QR designer. Falls back to hardcoded constants on error.
 */
export function useDesignShapes() {
  const { data: allAssets, isLoading } = useQuery({
    queryKey: queryKeys.designAssets.all(),
    queryFn: () => designAssetsAPI.getAll(),
    staleTime: 5 * 60_000,
    retry: false, // Admin-only endpoint — don't retry 403 for regular users
  })

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
}

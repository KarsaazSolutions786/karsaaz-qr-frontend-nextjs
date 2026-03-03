export type DesignAssetType =
  | 'module_style'
  | 'finder_outer_style'
  | 'finder_inner_style'
  | 'finder_dot_style'
  | 'outline_style'
  | 'advanced_shape'
  | 'preset_logo'

export interface DesignAsset {
  id: number
  type: DesignAssetType
  slug: string
  label: string
  thumbnail_url: string | null
  sort_order: number
  is_active: boolean
  category: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ReorderItem {
  id: number
  sort_order: number
}

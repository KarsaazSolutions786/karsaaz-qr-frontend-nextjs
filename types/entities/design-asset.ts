export type DesignAssetType =
  | 'module_style'
  | 'finder_outer_style'
  | 'finder_inner_style'
  | 'finder_dot_style'
  | 'outline_style'
  | 'advanced_shape'
  | 'preset_logo'

export type DesignAssetStatus = 'draft' | 'validating' | 'active' | 'failed_validation' | 'archived'

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
  // V2 registry fields (absent on pre-V2 backends)
  source?: 'built_in' | 'uploaded'
  status?: DesignAssetStatus
  version?: number
  checksum?: string | null
  template_path?: string | null
  published_at?: string | null
}

export interface ReorderItem {
  id: number
  sort_order: number
}

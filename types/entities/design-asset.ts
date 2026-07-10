export type DesignAssetType =
  | 'module_style'
  | 'finder_outer_style'
  | 'finder_inner_style'
  | 'finder_dot_style'
  | 'outline_style'
  | 'advanced_shape'
  | 'preset_logo'

export type DesignAssetStatus = 'draft' | 'validating' | 'active' | 'failed_validation' | 'archived'

// Engine contract — mirrors backend app/Services/DesignAssets/Engine/DesignAssetRenderContract.php.
// See Bugs/design-assets-engine-redesign/01-contract-spec.md §1 (spec SSOT). Every DesignAsset
// resolves to one of these; consumers should read `engine.*` instead of branching on `slug`.
export type DesignAssetEngineTarget =
  | 'qr_canvas'
  | 'qr_module'
  | 'qr_finder'
  | 'qr_finder_dot'
  | 'logo_slot'
export type DesignAssetEngineRenderMode = 'svg_template' | 'svg_path' | 'image'
export type DesignAssetEngineFit = 'contain' | 'cover' | 'stretch' | 'exact'

export interface DesignAssetEnginePlaceholder {
  id: string
  ids: string[]
  required: boolean
  fit: DesignAssetEngineFit
  padding: number
  preserveAspectRatio: boolean
}

export interface DesignAssetEngineCapabilities {
  supportsText: boolean
  supportsColors: boolean
  supportsLogo: boolean
  supportsOfflineFlutter: boolean
}

export const KNOWN_COLOR_SLOTS = [
  'frame',
  'background',
  'text',
  'heart',
  'circle',
  'star',
  'left',
  'right',
] as const
export type DesignAssetColorSlot = (typeof KNOWN_COLOR_SLOTS)[number]

export interface DesignAssetEngineControls {
  textLines: number
  colorSlots: DesignAssetColorSlot[]
}

export interface DesignAssetEngineContract {
  kind: DesignAssetType
  target: DesignAssetEngineTarget
  renderMode: DesignAssetEngineRenderMode
  placeholder: DesignAssetEnginePlaceholder | null
  capabilities: DesignAssetEngineCapabilities
  controls: DesignAssetEngineControls
  contractVersion: number
}

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
  // Engine contract (design-assets-engine-redesign, E4.1) — null for deprecated
  // types with no engine mapping (e.g. finder_inner_style) or resolution failure.
  engine?: DesignAssetEngineContract | null
}

export interface ReorderItem {
  id: number
  sort_order: number
}

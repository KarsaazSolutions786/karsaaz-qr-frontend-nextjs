// Biolink Entity Types

// Block Types
export type BlockType =
  | 'link'
  | 'text'
  | 'image'
  | 'title'
  | 'social-links'
  | 'video'
  | 'divider'

// Base Block Interface
export interface BlockBase {
  id: string
  type: BlockType
  order: number
}

// Specific Block Data Types
export interface LinkBlockData extends BlockBase {
  type: 'link'
  data: {
    url: string
    title: string
    icon?: string
    style?: 'button' | 'card' | 'minimal'
  }
}

export interface TextBlockData extends BlockBase {
  type: 'text'
  data: {
    content: string
    align?: 'left' | 'center' | 'right'
    size?: 'sm' | 'md' | 'lg'
  }
}

export interface ImageBlockData extends BlockBase {
  type: 'image'
  data: {
    url: string
    alt?: string
    link?: string
    caption?: string
  }
}

export interface TitleBlockData extends BlockBase {
  type: 'title'
  data: {
    text: string
    level?: 'h1' | 'h2' | 'h3'
    align?: 'left' | 'center' | 'right'
  }
}

export interface SocialLinksBlockData extends BlockBase {
  type: 'social-links'
  data: {
    links: Array<{
      platform: string
      url: string
      icon: string
    }>
  }
}

export interface VideoBlockData extends BlockBase {
  type: 'video'
  data: {
    url: string // YouTube or Vimeo URL
    title?: string
  }
}

export interface DividerBlockData extends BlockBase {
  type: 'divider'
  data: {
    style?: 'solid' | 'dashed' | 'dotted'
    color?: string
  }
}

// Union type of all blocks
export type BlockData =
  | LinkBlockData
  | TextBlockData
  | ImageBlockData
  | TitleBlockData
  | SocialLinksBlockData
  | VideoBlockData
  | DividerBlockData

// Biolink Theme
export interface BiolinkTheme {
  backgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  fontFamily?: string
}

// Biolink Entity
export interface Biolink {
  id: number
  userId: number
  slug: string
  title: string
  description: string | null
  avatar?: string | null
  theme: BiolinkTheme
  blocks: BlockData[]
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface BiolinksResponse {
  data: Biolink[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

// Create/Update DTOs
export interface CreateBiolinkRequest {
  slug: string
  title: string
  description?: string
  avatar?: string
  theme?: Partial<BiolinkTheme>
  blocks?: BlockData[]
  isPublished?: boolean
}

export interface UpdateBiolinkRequest extends Partial<CreateBiolinkRequest> {
  id: number
}

// Block Registry
export interface BlockDefinition {
  type: BlockType
  label: string
  icon: string
  category: 'core' | 'content' | 'social' | 'business'
  defaultData: any
}

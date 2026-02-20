// Dynamic Biolink Block Entity Types

export type BiolinkFieldType = 'text' | 'textarea' | 'image' | 'custom_code'

export interface BiolinkBlockField {
  id?: string
  name: string
  placeholder?: string
  type: BiolinkFieldType
  icon_id?: number
}

export interface DynamicBiolinkBlock {
  id: number
  name: string
  iconId?: number
  customCode?: string
  fields?: BiolinkBlockField[]
  createdAt: string
  updatedAt: string
}

export interface CreateDynamicBiolinkBlockRequest {
  name: string
  iconId?: number
  customCode?: string
  fields?: BiolinkBlockField[]
}

export interface DynamicBiolinkBlockListResponse {
  data: DynamicBiolinkBlock[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

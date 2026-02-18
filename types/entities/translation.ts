// Translation Entity Types

export interface Translation {
  id: number
  name: string
  displayName: string
  locale: string
  direction: 'rtl' | 'ltr'
  isActive: boolean
  isMain: boolean
  completeness: number
  flagFileId?: number
  createdAt: string
  updatedAt: string
}

export interface CreateTranslationRequest {
  name: string
  displayName?: string
  locale: string
  direction?: 'rtl' | 'ltr'
}

export interface TranslationListResponse {
  data: Translation[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

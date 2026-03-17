// Content Block Entity Types

export interface ContentBlock {
  id: number
  title: string
  position: string
  content: string
  sortOrder: number
  translationId?: number
  translation?: {
    name: string
  }
  createdAt: string
  updatedAt: string
  // Backend returns snake_case; these are fallback accessors
  created_at?: string
  updated_at?: string
}

export interface CreateContentBlockRequest {
  title: string
  position: string
  content: string
  sortOrder?: number
  translationId?: number
}

export interface ContentBlockListResponse {
  data: ContentBlock[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

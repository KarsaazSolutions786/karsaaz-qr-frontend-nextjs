// Page Entity Types

export interface Page {
  id: number
  title: string
  slug: string
  htmlContent: string
  metaDescription?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePageRequest {
  title: string
  slug?: string
  htmlContent: string
  metaDescription?: string
  published?: boolean
}

export interface PageListResponse {
  data: Page[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

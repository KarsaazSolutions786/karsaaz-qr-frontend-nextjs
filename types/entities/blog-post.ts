// Blog Post Entity Types

export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt?: string
  metaDescription?: string
  featuredImageId?: number
  publishedAt?: string
  translationId?: number
  createdAt: string
  updatedAt: string
}

export interface CreateBlogPostRequest {
  title: string
  content: string
  excerpt?: string
  metaDescription?: string
  publishedAt?: string
  translationId?: number
}

export interface BlogPostListResponse {
  data: BlogPost[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

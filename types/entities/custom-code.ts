// Custom Code Entity Types

export interface CustomCode {
  id: number
  name: string
  language: 'javascript' | 'html' | 'css'
  position: string
  sortOrder: number
  code: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomCodeRequest {
  name: string
  language: 'javascript' | 'html' | 'css'
  position: string
  sortOrder?: number
  code: string
}

export interface CustomCodeListResponse {
  data: CustomCode[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

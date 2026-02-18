// Contact Entity Types

export interface Contact {
  id: number
  name: string
  email: string
  subject: string
  message: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactRequest {
  name: string
  email: string
  subject: string
  message: string
  notes?: string
}

export interface ContactListResponse {
  data: Contact[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

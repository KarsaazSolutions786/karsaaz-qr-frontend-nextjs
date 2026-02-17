import apiClient from '../client'
import type {
  Biolink,
  BiolinksResponse,
  CreateBiolinkRequest,
  UpdateBiolinkRequest,
} from '@/types/entities/biolink'

export const biolinksAPI = {
  // Get all biolinks for the authenticated user
  getAll: async (params?: {
    page?: number
    perPage?: number
    search?: string
  }): Promise<BiolinksResponse> => {
    const response = await apiClient.get('/biolinks', { params })
    return response.data
  },

  // Get a single biolink by ID
  getById: async (id: number): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/${id}`)
    return response.data.data
  },

  // Get a biolink by slug (public view)
  getBySlug: async (slug: string): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/slug/${slug}`)
    return response.data.data
  },

  // Create a new biolink
  create: async (data: CreateBiolinkRequest): Promise<Biolink> => {
    const response = await apiClient.post('/biolinks', data)
    return response.data.data
  },

  // Update an existing biolink
  update: async (data: UpdateBiolinkRequest): Promise<Biolink> => {
    const { id, ...updateData } = data
    const response = await apiClient.put(`/biolinks/${id}`, updateData)
    return response.data.data
  },

  // Delete a biolink
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/biolinks/${id}`)
  },

  // Publish/unpublish a biolink
  togglePublish: async (id: number, isPublished: boolean): Promise<Biolink> => {
    const response = await apiClient.patch(`/biolinks/${id}/publish`, {
      isPublished,
    })
    return response.data.data
  },
}

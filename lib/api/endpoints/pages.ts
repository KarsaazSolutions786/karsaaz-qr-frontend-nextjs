import apiClient from '../client'
import type {
  Page,
  PageListResponse,
  CreatePageRequest,
} from '@/types/entities/page'

export const pagesAPI = {
  // Get all pages
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<PageListResponse>('/pages', { params })
    return response.data
  },

  // Get single page
  getById: async (id: number) => {
    const response = await apiClient.get<Page>(`/pages/${id}`)
    return response.data
  },

  // Create new page
  create: async (data: CreatePageRequest) => {
    const response = await apiClient.post<Page>('/pages', data)
    return response.data
  },

  // Update page
  update: async (id: number, data: Partial<CreatePageRequest>) => {
    const response = await apiClient.put<Page>(`/pages/${id}`, data)
    return response.data
  },

  // Delete page
  delete: async (id: number) => {
    await apiClient.delete(`/pages/${id}`)
  },
}

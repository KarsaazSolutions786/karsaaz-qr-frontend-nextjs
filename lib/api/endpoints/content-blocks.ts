import apiClient from '../client'
import type {
  ContentBlock,
  ContentBlockListResponse,
  CreateContentBlockRequest,
} from '@/types/entities/content-block'

export const contentBlocksAPI = {
  // Get all content blocks
  getAll: async (params?: { page?: number; search?: string; translation_id?: number }) => {
    const response = await apiClient.get<ContentBlockListResponse>('/content-blocks', { params })
    return response.data
  },

  // Get single content block
  getById: async (id: number) => {
    const response = await apiClient.get<ContentBlock>(`/content-blocks/${id}`)
    return response.data
  },

  // Create new content block
  create: async (data: CreateContentBlockRequest) => {
    const response = await apiClient.post<ContentBlock>('/content-blocks', data)
    return response.data
  },

  // Update content block
  update: async (id: number, data: Partial<CreateContentBlockRequest>) => {
    const response = await apiClient.put<ContentBlock>(`/content-blocks/${id}`, data)
    return response.data
  },

  // Delete content block
  delete: async (id: number) => {
    await apiClient.delete(`/content-blocks/${id}`)
  },

  // Delete all content blocks for a translation
  deleteByTranslation: async (translationId: number) => {
    await apiClient.delete(`/content-blocks/of-translation/${translationId}`)
  },

  // Copy content blocks from one translation to another
  copyBlocks: async (sourceId: number, destinationId: number) => {
    const response = await apiClient.post(
      `/content-blocks/copy/from/${sourceId}/to/${destinationId}`
    )
    return response.data
  },
}

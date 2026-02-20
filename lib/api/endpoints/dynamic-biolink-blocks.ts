import apiClient from '../client'
import type {
  DynamicBiolinkBlock,
  DynamicBiolinkBlockListResponse,
  CreateDynamicBiolinkBlockRequest,
} from '@/types/entities/dynamic-biolink-block'

export const dynamicBiolinkBlocksAPI = {
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<DynamicBiolinkBlockListResponse>(
      '/dynamic-biolink-blocks',
      { params }
    )
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get<DynamicBiolinkBlock>(
      `/dynamic-biolink-blocks/${id}`
    )
    return response.data
  },

  create: async (data: CreateDynamicBiolinkBlockRequest) => {
    const response = await apiClient.post<DynamicBiolinkBlock>(
      '/dynamic-biolink-blocks',
      data
    )
    return response.data
  },

  update: async (id: number, data: Partial<CreateDynamicBiolinkBlockRequest>) => {
    const response = await apiClient.put<DynamicBiolinkBlock>(
      `/dynamic-biolink-blocks/${id}`,
      data
    )
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`/dynamic-biolink-blocks/${id}`)
  },

  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ id: number; url: string }>(
      '/dynamic-biolink-blocks/store-file',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },
}

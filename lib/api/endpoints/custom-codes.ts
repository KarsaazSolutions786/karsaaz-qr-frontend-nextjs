import apiClient from '../client'
import type {
  CustomCode,
  CustomCodeListResponse,
  CreateCustomCodeRequest,
} from '@/types/entities/custom-code'

export const customCodesAPI = {
  // Get all custom codes
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<CustomCodeListResponse>('/custom-codes', { params })
    return response.data
  },

  // Get single custom code
  getById: async (id: number) => {
    const response = await apiClient.get<CustomCode>(`/custom-codes/${id}`)
    return response.data
  },

  // Create new custom code
  create: async (data: CreateCustomCodeRequest) => {
    const response = await apiClient.post<CustomCode>('/custom-codes', data)
    return response.data
  },

  // Update custom code
  update: async (id: number, data: Partial<CreateCustomCodeRequest>) => {
    const response = await apiClient.put<CustomCode>(`/custom-codes/${id}`, data)
    return response.data
  },

  // Delete custom code
  delete: async (id: number) => {
    await apiClient.delete(`/custom-codes/${id}`)
  },

  // Get available positions
  getPositions: async () => {
    const response = await apiClient.get<string[]>('/custom-codes/positions')
    return response.data
  },
}

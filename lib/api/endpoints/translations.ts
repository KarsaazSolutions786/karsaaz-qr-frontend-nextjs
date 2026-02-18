import apiClient from '../client'
import type {
  Translation,
  TranslationListResponse,
  CreateTranslationRequest,
} from '@/types/entities/translation'

export const translationsAPI = {
  // Get all translations
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<TranslationListResponse>('/translations', { params })
    return response.data
  },

  // Get single translation
  getById: async (id: number) => {
    const response = await apiClient.get<Translation>(`/translations/${id}`)
    return response.data
  },

  // Create new translation
  create: async (data: CreateTranslationRequest) => {
    const response = await apiClient.post<Translation>('/translations', data)
    return response.data
  },

  // Update translation
  update: async (id: number, data: Partial<CreateTranslationRequest>) => {
    const response = await apiClient.put<Translation>(`/translations/${id}`, data)
    return response.data
  },

  // Delete translation
  delete: async (id: number) => {
    await apiClient.delete(`/translations/${id}`)
  },

  // Set translation as main
  setMain: async (id: number) => {
    const response = await apiClient.post<Translation>(`/translations/${id}/set-main`)
    return response.data
  },

  // Toggle translation active status
  toggleActivate: async (id: number) => {
    const response = await apiClient.post<Translation>(`/translations/${id}/toggle-activate`)
    return response.data
  },

  // Trigger auto-translation
  autoTranslate: async (id: number) => {
    const response = await apiClient.post(`/translations/${id}/auto-translate`)
    return response.data
  },

  // Check if auto-translation is available
  canAutoTranslate: async () => {
    const response = await apiClient.get<{ available: boolean }>('/translations/can-auto-translate')
    return response.data
  },

  // Upload translation file
  upload: async (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post(
      `/translations/${id}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },
}

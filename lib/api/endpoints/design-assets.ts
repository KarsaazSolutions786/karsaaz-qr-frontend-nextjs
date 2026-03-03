import apiClient from '@/lib/api/client'
import type { DesignAsset, DesignAssetType, ReorderItem } from '@/types/entities/design-asset'

export interface CreateDesignAssetData {
  type: DesignAssetType
  slug: string
  label: string
  thumbnail_url?: string
  sort_order?: number
  is_active?: boolean
  category?: string
  metadata?: Record<string, unknown>
}

export const designAssetsAPI = {
  getAll: async (type?: DesignAssetType): Promise<DesignAsset[]> => {
    const params = type ? { type } : {}
    const { data } = await apiClient.get('/design-assets', { params })
    return data.data ?? data
  },

  create: async (payload: CreateDesignAssetData): Promise<DesignAsset> => {
    const { data } = await apiClient.post('/design-assets', payload)
    return data.data ?? data
  },

  update: async (id: number, payload: Partial<CreateDesignAssetData>): Promise<DesignAsset> => {
    const { data } = await apiClient.put(`/design-assets/${id}`, payload)
    return data.data ?? data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/design-assets/${id}`)
  },

  reorder: async (order: ReorderItem[]): Promise<void> => {
    await apiClient.post('/design-assets/reorder', { order })
  },

  toggleActive: async (id: number): Promise<DesignAsset> => {
    const { data } = await apiClient.post(`/design-assets/${id}/toggle-active`)
    return data.data ?? data
  },

  uploadThumbnail: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post('/design-assets/upload-thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

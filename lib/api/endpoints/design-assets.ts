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

export interface SvgAnalysisResult {
  valid: boolean
  detectedType: string | null
  viewBox: string | null
  pathCount: number
  hasPlaceholders: Record<string, boolean>
  renderConfig: Record<string, unknown> | null
  warnings: string[]
  errors: string[]
}

export interface UploadSvgResponse {
  message: string
  svg_path: string
  render?: Record<string, unknown>
  analysis?: {
    viewBox: string | null
    pathCount: number
    warnings: string[]
    analyzedAt: string
    hasPlaceholders?: Record<string, boolean>
    autoInjected?: boolean
  }
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

  bulkDelete: async (ids: number[]): Promise<{ deleted: number }> => {
    const { data } = await apiClient.delete('/design-assets', { data: { ids } })
    return data
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

  uploadShapeSvg: async (assetId: number, file: File): Promise<UploadSvgResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post(`/design-assets/${assetId}/upload-shape-svg`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  analyzeSvg: async (file: File, type?: DesignAssetType): Promise<SvgAnalysisResult> => {
    const formData = new FormData()
    formData.append('file', file)
    if (type) formData.append('type', type)
    const { data } = await apiClient.post('/design-assets/analyze-svg', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  previewAsset: async (assetId: number): Promise<{ content: string }> => {
    const { data } = await apiClient.get(`/design-assets/${assetId}/preview`)
    return data
  },
}

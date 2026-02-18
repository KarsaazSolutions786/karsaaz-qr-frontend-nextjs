import apiClient from '@/lib/api/client'
import { Sticker, StickerCategory } from '@/types/entities/sticker'

// Sticker API Endpoints

export interface ListStickersParams {
  category?: StickerCategory // Filter by category
  search?: string // Search by name or tags
  includeCustom?: boolean // Include user-uploaded stickers
  includeBuiltin?: boolean // Include built-in stickers
}

export interface UploadStickerRequest {
  name: string
  category?: StickerCategory
  tags?: string[]
}

// Sticker API functions
export const stickersAPI = {
  // List stickers (gallery)
  list: async (params: ListStickersParams = {}) => {
    const response = await apiClient.get<Sticker[]>('/stickers', { 
      params: {
        category: params.category,
        search: params.search,
        include_custom: params.includeCustom ?? true,
        include_builtin: params.includeBuiltin ?? true,
      }
    })
    return response.data
  },

  // Get single sticker
  get: async (id: string) => {
    const response = await apiClient.get<Sticker>(`/stickers/${id}`)
    return response.data
  },

  // Upload custom sticker
  upload: async (file: File, data: UploadStickerRequest) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', data.name)
    if (data.category) {
      formData.append('category', data.category)
    }
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags))
    }

    const response = await apiClient.post<Sticker>('/stickers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update sticker metadata
  update: async (id: string, data: Partial<UploadStickerRequest>) => {
    const response = await apiClient.put<Sticker>(`/stickers/${id}`, {
      name: data.name,
      category: data.category,
      tags: data.tags,
    })
    return response.data
  },

  // Delete custom sticker
  delete: async (id: string) => {
    await apiClient.delete(`/stickers/${id}`)
  },

  // Get stickers by category
  getByCategory: async (category: StickerCategory) => {
    const response = await apiClient.get<Sticker[]>('/stickers/category', {
      params: { category }
    })
    return response.data
  },

  // Get user's custom stickers
  getCustom: async () => {
    const response = await apiClient.get<Sticker[]>('/stickers/custom')
    return response.data
  },

  // Get built-in sticker gallery
  getBuiltin: async () => {
    const response = await apiClient.get<Sticker[]>('/stickers/builtin')
    return response.data
  },

  // Search stickers
  search: async (query: string) => {
    const response = await apiClient.get<Sticker[]>('/stickers/search', {
      params: { q: query }
    })
    return response.data
  },
}

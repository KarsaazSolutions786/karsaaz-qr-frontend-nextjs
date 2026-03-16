import apiClient from '../client'
import type {
  Translation,
  TranslationListResponse,
  CreateTranslationRequest,
} from '@/types/entities/translation'

/** Raw backend response shape (snake_case, Laravel paginated) */
interface RawTranslationItem {
  id: number
  name: string
  display_name: string
  locale: string
  direction: 'rtl' | 'ltr'
  is_active: boolean | number
  is_main: boolean
  is_default: boolean
  completeness: number
  flag_file_id?: number
  created_at: string
  updated_at: string
}

interface RawPaginatedResponse {
  data: RawTranslationItem[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/** Map a single backend item to the frontend Translation type */
function mapTranslation(raw: RawTranslationItem): Translation {
  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.display_name || raw.name,
    locale: raw.locale,
    direction: raw.direction || 'ltr',
    isActive: raw.is_active === true || raw.is_active === 1,
    isMain: !!raw.is_main,
    completeness: raw.completeness ?? 0,
    flagFileId: raw.flag_file_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

/** Map frontend camelCase request to backend snake_case */
function mapRequest(data: Partial<CreateTranslationRequest>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}
  if (data.name !== undefined) mapped.name = data.name
  if (data.displayName !== undefined) mapped.display_name = data.displayName
  if (data.locale !== undefined) mapped.locale = data.locale
  if (data.direction !== undefined) mapped.direction = data.direction
  // Pass through flagFileId if present
  if ((data as any).flagFileId !== undefined) mapped.flag_file_id = (data as any).flagFileId
  return mapped
}

export const translationsAPI = {
  // Get all translations (paginated)
  getAll: async (params?: { page?: number; search?: string }): Promise<TranslationListResponse> => {
    const response = await apiClient.get<RawPaginatedResponse>('/translations', { params })
    const raw = response.data
    return {
      data: (raw.data || []).map(mapTranslation),
      pagination: {
        total: raw.total,
        perPage: raw.per_page,
        currentPage: raw.current_page,
        lastPage: raw.last_page,
      },
    }
  },

  // Get single translation
  getById: async (id: number): Promise<Translation> => {
    const response = await apiClient.get<RawTranslationItem>(`/translations/${id}`)
    return mapTranslation(response.data)
  },

  // Create new translation
  create: async (data: CreateTranslationRequest): Promise<Translation> => {
    const response = await apiClient.post<RawTranslationItem>('/translations', mapRequest(data))
    return mapTranslation(response.data)
  },

  // Update translation
  update: async (id: number, data: Partial<CreateTranslationRequest>): Promise<Translation> => {
    const response = await apiClient.put<RawTranslationItem>(`/translations/${id}`, mapRequest(data))
    return mapTranslation(response.data)
  },

  // Delete translation
  delete: async (id: number) => {
    await apiClient.delete(`/translations/${id}`)
  },

  // Set translation as main
  setMain: async (id: number): Promise<Translation> => {
    const response = await apiClient.post<RawTranslationItem>(`/translations/${id}/set-main`)
    return mapTranslation(response.data)
  },

  // Toggle translation active status
  toggleActivate: async (id: number): Promise<Translation> => {
    const response = await apiClient.post<RawTranslationItem>(`/translations/${id}/toggle-activate`)
    return mapTranslation(response.data)
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

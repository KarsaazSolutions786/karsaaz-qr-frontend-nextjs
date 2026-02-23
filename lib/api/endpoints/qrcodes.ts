import apiClient from '@/lib/api/client'
import { QRCode } from '@/types/entities/qrcode'
import { PaginatedResponse } from '@/types/api'

// QR Code API Endpoints

export interface ListQRCodesParams {
  page?: number
  perPage?: number
  search?: string
  type?: string
  types?: string[] // Multiple types filter
  status?: 'active' | 'inactive' // Use search_archived for archived filter
  statuses?: string[] // Multiple statuses filter
  search_archived?: boolean // true = show archived QRs, false = show active QRs
  folderId?: string | null // Folder filter
  domainId?: string // T184: Domain filter
  tags?: string[] // Tags filter
  createdFrom?: string // ISO 8601
  createdTo?: string // ISO 8601
  updatedFrom?: string // ISO 8601
  updatedTo?: string // ISO 8601
  scansMin?: number // Minimum scan count
  scansMax?: number // Maximum scan count
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'scans'
  sortOrder?: 'asc' | 'desc'
}

// Backend response (snake_case)
interface BackendPaginationResponse {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from?: number
  to?: number
}

interface BackendPaginatedResponse<T> {
  success?: boolean
  data: T[]
  pagination: BackendPaginationResponse
}

// Transform backend response to frontend format
function transformPaginatedResponse<T>(
  response: BackendPaginatedResponse<T>
): PaginatedResponse<T> {
  // Handle case where response or pagination is undefined
  if (!response || !response.pagination) {
    return {
      data: response?.data || [],
      pagination: {
        currentPage: 1,
        perPage: 15,
        total: 0,
        lastPage: 1,
      },
    }
  }

  return {
    data: response.data || [],
    pagination: {
      currentPage: response.pagination.current_page || 1,
      perPage: response.pagination.per_page || 15,
      total: response.pagination.total || 0,
      lastPage: response.pagination.last_page || 1,
    },
  }
}

export interface CreateQRCodeRequest {
  type: string
  name: string
  data: any
  customization?: any
  design?: any // Backend expects 'design' field for QR design configuration
  stickerConfig?: any // New: Sticker configuration
  folderId?: string | null // New: Folder assignment
  status?: 'active' | 'inactive' | 'archived' // New: Status
  tags?: string[] // New: Tags
  password?: string
  domainId?: string
}

export interface UpdateQRCodeRequest {
  name?: string
  data?: any
  customization?: any
  design?: any // Backend expects 'design' field for QR design configuration
  stickerConfig?: any // New: Sticker configuration
  folderId?: string | null // New: Folder assignment
  status?: 'active' | 'inactive' | 'archived' // New: Status
  tags?: string[] // New: Tags
  password?: string
  domainId?: string
}

export interface ChangeQRTypeRequest {
  type: string
  data: any
}

export interface BulkCreateRequest {
  qrcodes: CreateQRCodeRequest[]
}

export interface BulkCreateResponse {
  created: QRCode[]
  failed: Array<{
    index: number
    error: string
  }>
}

// QR Code API functions

export const qrcodesAPI = {
  // List QR codes with pagination
  list: async (params: ListQRCodesParams = {}) => {
    try {
      const {
        sortBy,
        sortOrder,
        perPage,
        search,
        search_archived,
        folderId,
        scansMin,
        scansMax,
        createdFrom,
        createdTo,
        updatedFrom,
        updatedTo,
        ...restParams
      } = params

      // Build query params using backend's expected param names
      const queryParams: Record<string, unknown> = {
        ...restParams, // page, type, status, tags, etc.
        page_size: perPage, // backend uses page_size
        keyword: search, // backend uses keyword
        folder_id: folderId, // backend uses folder_id
        // Convert sortBy+sortOrder to Vue-compatible sort param (-field = desc)
        sort: sortBy ? (sortOrder === 'desc' ? `-${sortBy}` : sortBy) : undefined,
        ...(scansMin != null ? { scans_min: scansMin } : {}),
        ...(scansMax != null ? { scans_max: scansMax } : {}),
        ...(createdFrom ? { created_from: createdFrom } : {}),
        ...(createdTo ? { created_to: createdTo } : {}),
        ...(updatedFrom ? { updated_from: updatedFrom } : {}),
        ...(updatedTo ? { updated_to: updatedTo } : {}),
      }

      // Only include search_archived if explicitly set
      if (search_archived !== undefined) {
        queryParams.search_archived = search_archived
      }

      const response = await apiClient.get<BackendPaginatedResponse<QRCode>>('/qrcodes', {
        params: queryParams,
      })

      console.log('QR Codes API Response:', response.data)

      // Check if response has the expected structure
      if (!response.data) {
        console.warn('No data in response')
        return transformPaginatedResponse({ data: [], pagination: null as any })
      }

      return transformPaginatedResponse(response.data)
    } catch (error) {
      console.error('QR Codes fetch error:', error)
      throw error
    }
  },

  // Get single QR code
  get: async (id: string) => {
    const response = await apiClient.get<QRCode>(`/qrcodes/${id}`)
    return response.data
  },

  // Create QR code
  create: async (data: CreateQRCodeRequest) => {
    const response = await apiClient.post<QRCode>('/qrcodes', data)
    return response.data
  },

  // Update QR code
  update: async (id: string, data: UpdateQRCodeRequest) => {
    const response = await apiClient.put<QRCode>(`/qrcodes/${id}`, data)
    return response.data
  },

  // Delete QR code
  delete: async (id: string) => {
    await apiClient.delete(`/qrcodes/${id}`)
  },

  // Change QR code type
  changeType: async (id: string, data: ChangeQRTypeRequest) => {
    const response = await apiClient.put<QRCode>(`/qrcodes/${id}/type`, data)
    return response.data
  },

  // Bulk create QR codes
  bulkCreate: async (data: BulkCreateRequest) => {
    const response = await apiClient.post<BulkCreateResponse>('/qrcodes/bulk', data)
    return response.data
  },

  // Get QR code image
  getImage: async (id: string, format: 'png' | 'svg' = 'png') => {
    const response = await apiClient.get(`/qrcodes/${id}/image`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  },

  // Get QR code statistics
  getStats: async (id: string) => {
    const response = await apiClient.get(`/qrcodes/${id}/stats`)
    return response.data
  },

  // Clone QR code
  clone: async (id: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/clone`)
    return response.data
  },

  // Archive QR code
  archive: async (id: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/archive`)
    return response.data
  },

  // Unarchive QR code
  unarchive: async (id: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/unarchive`)
    return response.data
  },

  // Transfer ownership
  transferOwnership: async (id: string, newOwnerId: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/transfer`, {
      user_id: newOwnerId,
    })
    return response.data
  },

  // Set/Remove PIN protection
  setPIN: async (id: string, pin: string | null) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/pin`, {
      pin,
    })
    return response.data
  },

  // Get QR code redirect data (for public preview pages)
  getRedirect: async (id: string) => {
    const response = await apiClient.get(`/qrcodes/${id}/redirect`)
    return response.data
  },

  // Get QR code by slug (public endpoint)
  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/qrcodes/slug/${slug}`)
    return response.data
  },

  // Change QR code status
  changeStatus: async (id: string, status: 'active' | 'inactive') => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/change-status`, {
      status,
    })
    return response.data
  },

  // Change QR code user/owner
  changeUser: async (id: string, userId: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/change-user`, {
      user_id: userId,
    })
    return response.data
  },

  // Copy/Duplicate QR code (alternative to clone)
  copy: async (id: string) => {
    const response = await apiClient.post<QRCode>(`/qrcodes/${id}/copy`)
    return response.data
  },

  // Get compatible SVG
  getCompatibleSVG: async (id: string) => {
    const response = await apiClient.get(`/qrcodes/${id}/compatible-svg`, {
      responseType: 'text',
    })
    return response.data
  },

  // Count QR codes by type
  count: async (type?: string) => {
    const response = await apiClient.get('/qrcodes/count', {
      params: { qrcode_type: type },
    })
    return response.data
  },

  // Count total scans
  countScans: async (type?: string) => {
    const response = await apiClient.get('/qrcodes/count/scans', {
      params: { type },
    })
    return response.data
  },

  // Get reports
  getReports: async (id: string, slug: string) => {
    const response = await apiClient.get(`/qrcodes/${id}/reports/${slug}`)
    return response.data
  },
}

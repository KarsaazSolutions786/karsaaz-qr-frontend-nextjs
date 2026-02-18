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
  status?: 'active' | 'inactive' | 'archived'
  statuses?: string[] // Multiple statuses filter
  folderId?: string | null // Folder filter
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
function transformPaginatedResponse<T>(response: BackendPaginatedResponse<T>): PaginatedResponse<T> {
  return {
    data: response.data,
    pagination: {
      currentPage: response.pagination.current_page,
      perPage: response.pagination.per_page,
      total: response.pagination.total,
      lastPage: response.pagination.last_page,
    },
  }
}

export interface CreateQRCodeRequest {
  type: string
  name: string
  data: any
  customization?: any
  designerConfig?: any // New: Advanced designer configuration
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
  designerConfig?: any // New: Advanced designer configuration
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
    const response = await apiClient.get<BackendPaginatedResponse<QRCode>>('/qrcodes', { 
      params: {
        ...params,
        per_page: params.perPage, // Transform to snake_case for backend
        keyword: params.search, // Backend uses 'keyword' instead of 'search'
      }
    })
    return transformPaginatedResponse(response.data)
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
}

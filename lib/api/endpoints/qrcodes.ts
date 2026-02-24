import apiClient from '@/lib/api/client'
import { QRCode } from '@/types/entities/qrcode'
import { normalizePagination, PaginatedResponse } from '@/lib/api/pagination'

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

/**
 * Map a single backend QR code (snake_case) to frontend QRCode (camelCase).
 * Only maps known fields; passes everything else through unchanged so new
 * backend fields don't get silently dropped.
 */
function mapQRCode(raw: any): QRCode {
  return {
    ...raw,
    id: String(raw.id),
    userId: raw.user_id ?? raw.userId,
    name: raw.name ?? '',
    type: raw.type ?? 'url',
    data: raw.data,
    customization: raw.customization ?? raw.design ?? {},
    designerConfig: raw.design ?? raw.designerConfig,
    folderId: raw.folder_id ?? raw.folderId ?? null,
    status: raw.status ?? (raw.archived ? 'archived' : 'active'),
    domainId: raw.domain_id ?? raw.domainId,
    screenshotUrl:
      raw.qrcode_screenshot_url ?? raw.simple_png_url ?? raw.screenshotUrl ?? raw.screenshot_url,
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    updatedAt: raw.updated_at ?? raw.updatedAt ?? '',
    scans: raw.scans_count ?? raw.scans ?? 0,
    tags: raw.tags ?? [],
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

      const response = await apiClient.get('/qrcodes', {
        params: queryParams,
      })

      // Normalize flat Laravel pagination and map QR codes
      const normalized = normalizePagination<any>(response.data)
      return {
        data: normalized.data.map(mapQRCode),
        pagination: normalized.pagination,
      } as PaginatedResponse<QRCode>
    } catch (error) {
      console.error('QR Codes fetch error:', error)
      throw error
    }
  },

  // Get single QR code
  get: async (id: string) => {
    const response = await apiClient.get(`/qrcodes/${id}`)
    return mapQRCode(response.data)
  },

  // Create QR code
  create: async (data: CreateQRCodeRequest) => {
    const response = await apiClient.post('/qrcodes', data)
    return mapQRCode(response.data)
  },

  // Update QR code
  update: async (id: string, data: UpdateQRCodeRequest) => {
    const response = await apiClient.put(`/qrcodes/${id}`, data)
    return mapQRCode(response.data)
  },

  // Delete QR code
  delete: async (id: string) => {
    await apiClient.delete(`/qrcodes/${id}`)
  },

  // Change QR code type
  changeType: async (id: string, data: ChangeQRTypeRequest) => {
    const response = await apiClient.put(`/qrcodes/${id}/type`, data)
    return mapQRCode(response.data)
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
    const response = await apiClient.post(`/qrcodes/${id}/clone`)
    return mapQRCode(response.data)
  },

  // Archive QR code
  archive: async (id: string) => {
    const response = await apiClient.post(`/qrcodes/${id}/archive`)
    return mapQRCode(response.data)
  },

  // Unarchive QR code
  unarchive: async (id: string) => {
    const response = await apiClient.post(`/qrcodes/${id}/unarchive`)
    return mapQRCode(response.data)
  },

  // Transfer ownership
  transferOwnership: async (id: string, newOwnerId: string) => {
    const response = await apiClient.post(`/qrcodes/${id}/transfer`, {
      user_id: newOwnerId,
    })
    return mapQRCode(response.data)
  },

  // Set/Remove PIN protection
  setPIN: async (id: string, pin: string | null) => {
    const response = await apiClient.post(`/qrcodes/${id}/pin`, {
      pin,
    })
    return mapQRCode(response.data)
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
    const response = await apiClient.post(`/qrcodes/${id}/change-status`, {
      status,
    })
    return mapQRCode(response.data)
  },

  // Change QR code user/owner
  changeUser: async (id: string, userId: string) => {
    const response = await apiClient.post(`/qrcodes/${id}/change-user`, {
      user_id: userId,
    })
    return mapQRCode(response.data)
  },

  // Copy/Duplicate QR code (alternative to clone)
  copy: async (id: string) => {
    const response = await apiClient.post(`/qrcodes/${id}/copy`)
    return mapQRCode(response.data)
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

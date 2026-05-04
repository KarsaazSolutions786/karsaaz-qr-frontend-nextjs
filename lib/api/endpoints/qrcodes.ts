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
function mapQRCode(raw: Record<string, unknown>): QRCode {
  const r = raw as Record<string, unknown>  // narrowed access below
  return {
    ...(r as object),
    id: String(r.id),
    userId: (r.user_id ?? r.userId) as string,
    name: (r.name ?? '') as string,
    type: (r.type ?? 'url') as QRCode['type'],
    data: r.data as QRCode['data'],
    customization: (r.customization ?? r.design ?? {}) as QRCode['customization'],
    designerConfig: (r.design ?? r.designerConfig) as QRCode['designerConfig'],
    folderId: (r.folder_id ?? r.folderId ?? null) as string | null,
    status:
      r.status === 'enabled' ? 'active' : ((r.status ?? (r.archived ? 'archived' : 'active')) as QRCode['status']),
    domainId: (r.domain_id ?? r.domainId) as string | undefined,
    screenshotUrl:
      (r.qrcode_screenshot_url ?? r.simple_png_url ?? r.screenshotUrl ?? r.screenshot_url) as string | undefined,
    svgUrl: (r.svg_url ?? r.svgUrl) as string | undefined,
    createdAt: (r.created_at ?? r.createdAt ?? '') as string,
    updatedAt: (r.updated_at ?? r.updatedAt ?? '') as string,
    scans: (r.scans_count ?? r.scans ?? 0) as number,
    tags: (r.tags ?? []) as string[],
  }
}

export interface CreateQRCodeRequest {
  type: string
  name: string
  data: Record<string, unknown>
  customization?: Record<string, unknown>
  design?: object // Backend expects 'design' field for QR design configuration
  stickerConfig?: object // Sticker configuration
  folderId?: string | null // Folder assignment
  status?: 'active' | 'inactive' | 'archived'
  tags?: string[]
  password?: string
  domainId?: string
}

export interface UpdateQRCodeRequest {
  name?: string
  data?: Record<string, unknown>
  customization?: Record<string, unknown>
  design?: object // Backend expects 'design' field for QR design configuration
  stickerConfig?: object // Sticker configuration
  folderId?: string | null // Folder assignment
  status?: 'active' | 'inactive' | 'archived'
  tags?: string[]
  password?: string
  domainId?: string
}

export interface ChangeQRTypeRequest {
  type: string
  data: Record<string, unknown>
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
  list: async (params: ListQRCodesParams = {}, signal?: AbortSignal) => {
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
        signal, // abort in-flight request when page changes
      })

      // Normalize flat Laravel pagination and map QR codes
      const normalized = normalizePagination<Record<string, unknown>>(response.data)
      return {
        data: normalized.data.map(mapQRCode),
        pagination: normalized.pagination,
      } as PaginatedResponse<QRCode>
    } catch (error: unknown) {
      // Don't log aborted requests (cancelled by page navigation)
      if (process.env.NODE_ENV === 'development') {
        const code = (error as { code?: string })?.code
        if (code !== 'ERR_CANCELED') {
          console.error('QR Codes fetch error:', error)
        }
      }
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
    // Map camelCase fields to snake_case for backend
    const payload: Record<string, unknown> = { ...data }
    if ('folderId' in payload) {
      payload.folder_id = payload.folderId ? Number(payload.folderId) : null
      delete payload.folderId
    }
    if ('domainId' in payload) {
      payload.domain_id = payload.domainId
      delete payload.domainId
    }
    if ('stickerConfig' in payload) {
      payload.sticker_config = payload.stickerConfig
      delete payload.stickerConfig
    }
    const response = await apiClient.put(`/qrcodes/${id}`, payload)
    return mapQRCode(response.data)
  },

  // Move QR code to folder — fetches QR first to include required 'type' field
  moveToFolder: async (id: string, folderId: string | number | null) => {
    const current = await apiClient.get(`/qrcodes/${id}`)
    // CRUD show() returns the model directly (not wrapped)
    const qr = current.data
    const response = await apiClient.put(`/qrcodes/${id}`, {
      ...qr,
      folder_id: folderId ? Number(folderId) : null,
    })
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

  // Get QR code report by slug (e.g. scans-per-day, scans-per-country)
  getReport: async (id: string, slug: string, dateRange?: { from?: string; to?: string }) => {
    const params: Record<string, string> = {}
    if (dateRange?.from) params.from = dateRange.from
    if (dateRange?.to) params.to = dateRange.to
    const response = await apiClient.get(`/qrcodes/${id}/reports/${slug}`, { params })
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

  // Get QR code analytics — alias for getReport('scans-per-day')
  getAnalytics: async (id: string | number) => {
    const response = await apiClient.get(`/qrcodes/${id}/reports/scans-per-day`)
    return response.data
  },

  // Get QR code link settings
  getLinkSettings: async (id: string | number) => {
    const response = await apiClient.get(`/qrcodes/${id}/link-settings`)
    return response.data
  },

  // Update QR code link settings
  updateLinkSettings: async (
    id: string | number,
    data: { slug: string; redirectEnabled: boolean }
  ) => {
    const response = await apiClient.put(`/qrcodes/${id}/link-settings`, data)
    return response.data
  },

  // Upload logo for QR code
  uploadLogo: async (id: string | number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post(`/qrcodes/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete logo from QR code
  deleteLogo: async (id: string | number) => {
    const response = await apiClient.delete(`/qrcodes/${id}/logo`)
    return response.data
  },

  // Upload foreground/background image for QR code
  uploadForegroundImage: async (id: string | number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post(`/qrcodes/${id}/background-image`, formData)
    return response.data
  },

  // Delete foreground image from QR code
  deleteForegroundImage: async (id: string | number) => {
    const response = await apiClient.delete(`/qrcodes/${id}/background-image`)
    return response.data
  },
}

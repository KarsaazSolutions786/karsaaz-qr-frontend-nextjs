import apiClient from '@/lib/api/client'

// Bulk Operations API Endpoints

export interface BulkDeleteRequest {
  qrcodeIds: string[] // QR code IDs to delete
}

export interface BulkDeleteResponse {
  success: boolean
  deleted: number
  failed: Array<{
    id: string
    error: string
  }>
}

export interface BulkMoveRequest {
  qrcodeIds: string[] // QR code IDs to move
  folderId: string | null // Target folder ID (null for root)
}

export interface BulkMoveResponse {
  success: boolean
  moved: number
  failed: Array<{
    id: string
    error: string
  }>
}

export interface BulkStatusChangeRequest {
  qrcodeIds: string[] // QR code IDs to update
  status: 'active' | 'inactive' | 'archived'
}

export interface BulkStatusChangeResponse {
  success: boolean
  updated: number
  failed: Array<{
    id: string
    error: string
  }>
}

export interface BulkExportRequest {
  qrcodeIds: string[] // QR code IDs to export
  format?: 'csv' | 'json' // Export format
}

export interface BulkDownloadRequest {
  qrcodeIds: string[] // QR code IDs to download
  format: 'png' | 'svg' | 'pdf' // Image format
  size?: number // Image size in pixels
  quality?: number // Image quality (0-1)
}

export interface BulkTagRequest {
  qrcodeIds: string[] // QR code IDs to tag
  tags: string[] // Tags to add
  action: 'add' | 'remove' | 'replace' // Tag action
}

export interface BulkTagResponse {
  success: boolean
  updated: number
  failed: Array<{
    id: string
    error: string
  }>
}

// Bulk Operations API functions
export const bulkOperationsAPI = {
  // Bulk delete QR codes
  delete: async (data: BulkDeleteRequest) => {
    const response = await apiClient.post<BulkDeleteResponse>('/qrcodes/bulk/delete', {
      qrcode_ids: data.qrcodeIds,
    })
    return response.data
  },

  // Bulk move QR codes to folder
  move: async (data: BulkMoveRequest) => {
    const response = await apiClient.post<BulkMoveResponse>('/qrcodes/bulk/move', {
      qrcode_ids: data.qrcodeIds,
      folder_id: data.folderId,
    })
    return response.data
  },

  // Bulk change status
  changeStatus: async (data: BulkStatusChangeRequest) => {
    const response = await apiClient.post<BulkStatusChangeResponse>('/qrcodes/bulk/status', {
      qrcode_ids: data.qrcodeIds,
      status: data.status,
    })
    return response.data
  },

  // Bulk archive QR codes
  archive: async (qrcodeIds: string[]) => {
    return bulkOperationsAPI.changeStatus({
      qrcodeIds,
      status: 'archived',
    })
  },

  // Bulk unarchive QR codes
  unarchive: async (qrcodeIds: string[]) => {
    return bulkOperationsAPI.changeStatus({
      qrcodeIds,
      status: 'active',
    })
  },

  // Bulk export QR codes (CSV/JSON)
  export: async (data: BulkExportRequest) => {
    const response = await apiClient.post('/qrcodes/bulk/export', {
      qrcode_ids: data.qrcodeIds,
      format: data.format ?? 'csv',
    }, {
      responseType: 'blob',
    })
    return response.data
  },

  // Bulk download QR code images (ZIP)
  download: async (data: BulkDownloadRequest) => {
    const response = await apiClient.post('/qrcodes/bulk/download', {
      qrcode_ids: data.qrcodeIds,
      format: data.format,
      size: data.size ?? 600,
      quality: data.quality ?? 0.95,
    }, {
      responseType: 'blob',
    })
    return response.data
  },

  // Bulk tag operations
  updateTags: async (data: BulkTagRequest) => {
    const response = await apiClient.post<BulkTagResponse>('/qrcodes/bulk/tags', {
      qrcode_ids: data.qrcodeIds,
      tags: data.tags,
      action: data.action,
    })
    return response.data
  },

  // Bulk add tags
  addTags: async (qrcodeIds: string[], tags: string[]) => {
    return bulkOperationsAPI.updateTags({
      qrcodeIds,
      tags,
      action: 'add',
    })
  },

  // Bulk remove tags
  removeTags: async (qrcodeIds: string[], tags: string[]) => {
    return bulkOperationsAPI.updateTags({
      qrcodeIds,
      tags,
      action: 'remove',
    })
  },

  // Bulk replace tags
  replaceTags: async (qrcodeIds: string[], tags: string[]) => {
    return bulkOperationsAPI.updateTags({
      qrcodeIds,
      tags,
      action: 'replace',
    })
  },

  // Get bulk operation status (for long-running operations)
  getOperationStatus: async (operationId: string) => {
    const response = await apiClient.get<{
      id: string
      status: 'pending' | 'processing' | 'completed' | 'failed'
      progress: number // 0-100
      total: number
      processed: number
      failed: number
      error?: string
    }>(`/qrcodes/bulk/operations/${operationId}`)
    return response.data
  },

  // Get bulk import URL instances
  getImportUrlInstances: async () => {
    const response = await apiClient.get('/bulk-operations/import-url-qrcodes/instances')
    const data = response.data as any
    return Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
  },

  // Get single bulk import URL instance
  getImportUrlInstance: async (id: string) => {
    const response = await apiClient.get(`/bulk-operations/import-url-qrcodes/instances`)
    const data = response.data as any
    const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
    return list.find((i: any) => String(i.id) === id) || null
  },

  // Create bulk import from CSV file
  createImportFromCsv: async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const response = await apiClient.post('/bulk-operations/import-url-qrcodes/create', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Re-run a bulk operation
  reRunInstance: async (id: number) => {
    const response = await apiClient.post(`/bulk-operations/${id}/re-run`)
    return response.data
  },

  // Delete a bulk operation instance
  deleteInstance: async (id: number) => {
    await apiClient.delete(`/bulk-operations/${id}`)
  },

  // Delete all QR codes from a bulk operation instance
  deleteAllQRCodes: async (id: number) => {
    await apiClient.delete(`/bulk-operations/${id}/all-qrcodes`)
  },

  // Rename a bulk operation instance
  renameInstance: async (id: number, name: string) => {
    const response = await apiClient.post(`/bulk-operations/edit-instance-name/${id}`, { name })
    return response.data
  },
}

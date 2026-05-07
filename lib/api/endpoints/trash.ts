import apiClient from '../client'
import type { QRCode } from '@/types/entities/qrcode'

export interface TrashListParams {
  search?: string
  per_page?: number
  page?: number
}

export interface TrashPagination {
  total: number
  perPage: number
  page: number
  lastPage: number
}

export interface TrashListResponse {
  data: QRCode[]
  pagination: TrashPagination
  trash_count: number
  trash_limit: number
}

export interface TrashSettings {
  trash_auto_delete_days: number | null
  trash_storage_limit_mb: number
  estimated_storage_mb: number
  trash_count: number
  trash_limit: number
}

export const trashAPI = {
  /**
   * List trashed QR codes for the current user.
   */
  async list(params: TrashListParams = {}): Promise<TrashListResponse> {
    const response = await apiClient.get('/qrcodes/trash', { params })
    return response.data
  },

  /**
   * Restore a single trashed QR code.
   */
  async restore(id: number | string): Promise<{ message: string; data: QRCode }> {
    const response = await apiClient.post(`/qrcodes/trash/${id}/restore`)
    return response.data
  },

  /**
   * Restore multiple trashed QR codes.
   */
  async restoreMany(ids: (number | string)[]): Promise<{ message: string; restored: number }> {
    const response = await apiClient.post('/qrcodes/trash/restore-many', { ids })
    return response.data
  },

  /**
   * Permanently delete a single trashed QR code.
   */
  async destroy(id: number | string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/qrcodes/trash/${id}`)
    return response.data
  },

  /**
   * Permanently delete multiple trashed QR codes.
   */
  async destroyMany(ids: (number | string)[]): Promise<{ message: string; deleted: number }> {
    const response = await apiClient.delete('/qrcodes/trash/destroy-many', { data: { ids } })
    return response.data
  },

  /**
   * Permanently delete all trashed QR codes (empty trash).
   */
  async empty(): Promise<{ message: string; deleted: number }> {
    const response = await apiClient.post('/qrcodes/trash/empty')
    return response.data
  },

  /**
   * Get the user's trash settings (auto-delete days + counts).
   */
  async getSettings(): Promise<TrashSettings> {
    const response = await apiClient.get('/qrcodes/trash/settings')
    return response.data
  },

  /**
   * Update the user's trash settings (auto-delete and/or storage limit).
   */
  async updateSettings(data: {
    trash_auto_delete_days?: number | null
    trash_storage_limit_mb?: number
  }): Promise<{
    message: string
    trash_auto_delete_days: number | null
    trash_storage_limit_mb: number
  }> {
    const response = await apiClient.put('/qrcodes/trash/settings', data)
    return response.data
  },
}

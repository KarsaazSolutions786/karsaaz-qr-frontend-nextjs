import apiClient from '../client'
import type { QRCode } from '@/types/entities/qrcode'
import { mapQRCode } from './qrcodes'

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
   * Purpose: List trashed QR codes for the current user.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async list(params: TrashListParams = {}): Promise<TrashListResponse> {
    const response = await apiClient.get('/qrcodes/trash', { params })
    const data = response.data
    return {
      ...data,
      data: (data.data || []).map((raw: any) => mapQRCode(raw)),
    }
  },

  /**
   * Purpose: Restore a single trashed QR code.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async restore(id: number | string): Promise<{ message: string; data: QRCode }> {
    const response = await apiClient.post(`/qrcodes/trash/${id}/restore`)
    const data = response.data
    return {
      ...data,
      data: data.data ? mapQRCode(data.data) : undefined,
    }
  },

  /**
   * Purpose: Restore multiple trashed QR codes.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async restoreMany(ids: (number | string)[]): Promise<{ message: string; restored: number }> {
    const response = await apiClient.post('/qrcodes/trash/restore-many', { ids })
    return response.data
  },

  /**
   * Purpose: Permanently delete a single trashed QR code.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async destroy(id: number | string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/qrcodes/trash/${id}`)
    return response.data
  },

  /**
   * Purpose: Permanently delete multiple trashed QR codes.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async destroyMany(ids: (number | string)[]): Promise<{ message: string; deleted: number }> {
    const response = await apiClient.delete('/qrcodes/trash/destroy-many', { data: { ids } })
    return response.data
  },

  /**
   * Purpose: Permanently delete all trashed QR codes (empty trash).
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async empty(): Promise<{ message: string; deleted: number }> {
    const response = await apiClient.post('/qrcodes/trash/empty')
    return response.data
  },

  /**
   * Purpose: Get the user's trash settings (auto-delete days + counts).
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */

  async getSettings(): Promise<TrashSettings> {
    const response = await apiClient.get('/qrcodes/trash/settings')
    return response.data
  },

  /**
   * Purpose: Update the user's trash settings (auto-delete and/or storage limit).
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
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

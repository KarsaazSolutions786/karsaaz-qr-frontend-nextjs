'use client'

import apiClient from '../client'
import { getGuestHeaders } from './guest'

export interface StorageUsageStats {
  used_bytes: number
  quota_bytes: number
  percentage: number
  remaining_bytes: number
  used_formatted: string
  quota_formatted: string
  remaining_formatted: string
  is_unlimited: boolean
  files_count: number
  files_without_size: number
}

export interface GuestStorageStats {
  used_bytes: number
  quota_bytes: number
  percentage: number
  remaining_bytes: number
  used_formatted: string
  quota_formatted: string
  remaining_formatted: string
}

export const storageAPI = {
  /**
   * Purpose: Get storage usage stats for the authenticated user
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */

  async getUsage(): Promise<StorageUsageStats> {
    const response = await apiClient.get('/storage/usage')
    return response.data.data
  },

  /**
   * Purpose: Get storage usage for guest session
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */

  async getGuestUsage(): Promise<GuestStorageStats> {
    const response = await apiClient.get('/guest/storage', { headers: getGuestHeaders() })
    return response.data.data
  },

  /**
   * Purpose: Trigger storage recalculation for the current user
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */

  async recalculate(): Promise<StorageUsageStats> {
    const response = await apiClient.post('/storage/recalculate')
    return response.data.data
  },
}

'use client'

import apiClient from '../client'

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
   * Get storage usage stats for the authenticated user
   */
  async getUsage(): Promise<StorageUsageStats> {
    const response = await apiClient.get('/storage/usage')
    return response.data.data
  },

  /**
   * Get storage usage for guest session
   */
  async getGuestUsage(): Promise<GuestStorageStats> {
    const response = await apiClient.get('/guest/storage')
    return response.data.data
  },

  /**
   * Trigger storage recalculation for the current user
   */
  async recalculate(): Promise<StorageUsageStats> {
    const response = await apiClient.post('/storage/recalculate')
    return response.data.data
  },
}

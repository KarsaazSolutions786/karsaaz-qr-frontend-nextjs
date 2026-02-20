/**
 * Sidebar API Functions
 * Matches Lit frontend menu-store.js data fetching
 */

import apiClient from './client'
import { foldersAPI } from './endpoints/folders'
import { getTemplateCategories as fetchTemplateCategories } from './endpoints/templates'
import type { Folder } from '@/types/entities/folder'
import type { TemplateCategory } from '@/types/entities/template'

// User stats for account widget
export interface UserStats {
  dynamic_qrcodes_count: number
  total_scans: number
}

// Plan info
export interface Plan {
  id: number
  name: string
  number_of_dynamic_qrcodes: number | 'unlimited'
  number_of_scans: number | 'unlimited'
  is_trial: boolean
  price?: number
  currency?: string
}

/**
 * Fetch user's folders with QR counts for sidebar
 * Uses existing folders API
 */
export async function getSidebarFolders(): Promise<Folder[]> {
  try {
    const folders = await foldersAPI.list()
    return folders || []
  } catch (error) {
    console.error('Failed to fetch sidebar folders:', error)
    return []
  }
}

/**
 * Fetch template categories for sidebar
 * Uses existing templates API
 */
export async function getSidebarTemplateCategories(): Promise<TemplateCategory[]> {
  try {
    const categories = await fetchTemplateCategories()
    return categories || []
  } catch (error) {
    console.error('Failed to fetch sidebar template categories:', error)
    return []
  }
}

/**
 * Get count of dynamic QR codes
 * Matches Lit frontend getDynamicQRCodeCount()
 */
export async function getDynamicQRCodeCount(): Promise<number> {
  try {
    // Dynamic QR types (matching Lit frontend QRCodeTypeManager.getDynamicSlugs())
    const dynamicTypes = [
      'url', 'vcard', 'wifi', 'email', 'sms', 'phone', 'location',
      'calendar', 'business-profile', 'restaurant-menu', 'event',
      'product-catalogue', 'business-review', 'app-download', 'biolink'
    ].join(',')
    
    const response = await apiClient.get('/qrcodes', {
      params: {
        type: dynamicTypes,
        per_page: 1 // Only need count, not data
      }
    })
    
    // Check if response has pagination data
    return response.data?.meta?.total || response.data?.length || 0
  } catch (error) {
    console.error('Failed to fetch QR code count:', error)
    return 0
  }
}

/**
 * Get total scan count
 * Matches Lit frontend getTotalScans()
 */
export async function getTotalScans(): Promise<number> {
  try {
    const dynamicTypes = [
      'url', 'vcard', 'wifi', 'email', 'sms', 'phone', 'location',
      'calendar', 'business-profile', 'restaurant-menu', 'event',
      'product-catalogue', 'business-review', 'app-download', 'biolink'
    ].join(',')
    
    const response = await apiClient.get('/analytics/total-scans', {
      params: { type: dynamicTypes }
    })
    
    return response.data?.total || response.data?.count || 0
  } catch (error) {
    console.error('Failed to fetch total scans:', error)
    return 0
  }
}

/**
 * Get user's current plan
 * Matches Lit frontend currentPlan()
 */
export async function getCurrentPlan(): Promise<Plan | null> {
  try {
    const response = await apiClient.get('/user/subscription')
    return response.data?.plan || response.data || null
  } catch (error) {
    console.error('Failed to fetch current plan:', error)
    return null
  }
}

/**
 * Get all user stats at once
 */
export async function getUserStats(): Promise<UserStats> {
  const [qrCount, scans] = await Promise.all([
    getDynamicQRCodeCount(),
    getTotalScans()
  ])
  
  return {
    dynamic_qrcodes_count: qrCount,
    total_scans: scans
  }
}

/**
 * Format unlimited/numeric values for display
 * Matches BillingMode.formatTotalNumber() from Lit frontend
 */
export function formatLimit(value: number | 'unlimited' | string): string {
  if (value === 'unlimited' || value === '0' || value === 0) {
    return 'Unlimited'
  }
  
  if (typeof value === 'string') {
    const num = parseInt(value, 10)
    if (isNaN(num)) return 'Unlimited'
    return num.toLocaleString()
  }
  
  return value.toLocaleString()
}

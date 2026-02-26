import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { SubscriptionPlan, CreateSubscriptionPlanRequest } from '@/types/entities/plan'

/**
 * Map backend snake_case plan to frontend camelCase SubscriptionPlan.
 */
function mapPlan(raw: any): SubscriptionPlan {
  return {
    ...raw,
    id: raw.id,
    name: raw.name ?? '',
    price: raw.price ?? 0,
    frequency: raw.frequency ?? 'monthly',
    sortOrder: raw.sort_order ?? raw.sortOrder ?? 0,
    isHidden: raw.is_hidden ?? raw.isHidden ?? false,
    isTrial: raw.is_trial ?? raw.isTrial ?? false,
    trialDays: raw.trial_days ?? raw.trialDays ?? 0,
    numberOfDynamicQrcodes: raw.number_of_dynamic_qrcodes ?? raw.numberOfDynamicQrcodes ?? 0,
    numberOfScans: raw.number_of_scans ?? raw.numberOfScans ?? 0,
    numberOfCustomDomains: raw.number_of_custom_domains ?? raw.numberOfCustomDomains ?? 0,
    fileSizeLimit: raw.file_size_limit ?? raw.fileSizeLimit ?? 0,
    numberOfUsers: raw.number_of_users ?? raw.numberOfUsers ?? 1,
    showAds: raw.show_ads ?? raw.showAds ?? false,
    adsTimeout: raw.ads_timeout ?? raw.adsTimeout ?? 0,
    qrTypes: raw.qr_types ?? raw.qrTypes ?? [],
    features: raw.features ?? [],
    checkpoints: raw.checkpoints ?? [],
    qrTypeLimits: raw.qr_type_limits ?? raw.qrTypeLimits ?? [],
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    updatedAt: raw.updated_at ?? raw.updatedAt ?? '',
  }
}

export const plansAPI = {
  // Get all subscription plans
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/subscription-plans', { params: mapSearchParams(params) })
    const normalized = normalizePagination<any>(response.data)
    return {
      ...normalized,
      data: normalized.data.map(mapPlan),
    }
  },

  // Get single subscription plan
  getById: async (id: number) => {
    const response = await apiClient.get(`/subscription-plans/${id}`)
    return mapPlan(response.data)
  },

  // Create new subscription plan
  create: async (data: CreateSubscriptionPlanRequest) => {
    const response = await apiClient.post<SubscriptionPlan>('/subscription-plans', data)
    return response.data
  },

  // Update subscription plan
  update: async (id: number, data: Partial<CreateSubscriptionPlanRequest>) => {
    const response = await apiClient.put<SubscriptionPlan>(`/subscription-plans/${id}`, data)
    return response.data
  },

  // Delete subscription plan
  delete: async (id: number) => {
    await apiClient.delete(`/subscription-plans/${id}`)
  },

  // Duplicate subscription plan
  duplicate: async (id: number) => {
    const response = await apiClient.post<SubscriptionPlan>(`/subscription-plans/${id}/duplicate`)
    return response.data
  },
}

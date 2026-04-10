import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { SubscriptionPlan, CreateSubscriptionPlanRequest } from '@/types/entities/plan'

/**
 * Map backend snake_case plan to frontend camelCase SubscriptionPlan.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API response from backend
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
    numberOfRestaurantMenuItems:
      raw.number_of_restaurant_menu_items ?? raw.numberOfRestaurantMenuItems ?? 0,
    numberOfProductCatalogueItems:
      raw.number_of_product_catalogue_items ?? raw.numberOfProductCatalogueItems ?? 0,
    numberOfAiGenerations: raw.number_of_ai_generations ?? raw.numberOfAiGenerations ?? 0,
    numberOfBulkCreatedQrcodes:
      raw.number_of_bulk_created_qrcodes ?? raw.numberOfBulkCreatedQrcodes ?? 0,
    showAds: (raw.show_ads === 'enabled' || raw.show_ads === true) ?? raw.showAds ?? false,
    adsTimeout: raw.ads_timeout ?? raw.adsTimeout ?? 0,
    adsCode: raw.ads_code ?? raw.adsCode ?? '',
    qrTypes: raw.qr_types ?? raw.qrTypes ?? [],
    unavailableTypesBehaviour:
      raw.unavailable_types_behaviour ?? raw.unavailableTypesBehaviour ?? 'show_upgrade_message',
    features: raw.features ?? [],
    checkpoints: raw.checkpoints ?? [],
    qrTypeLimits: raw.qr_type_limits ?? raw.qrTypeLimits ?? [],
    hasApiAccess: raw.has_api_access ?? raw.hasApiAccess ?? false,
    apiMonthlyRequests: raw.api_monthly_requests ?? raw.apiMonthlyRequests ?? 1000,
    apiRateLimitPerMinute: raw.api_rate_limit_per_minute ?? raw.apiRateLimitPerMinute ?? 60,
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    updatedAt: raw.updated_at ?? raw.updatedAt ?? '',
  }
}

/**
 * Convert frontend camelCase plan data to backend snake_case for create/update.
 */
function toSnakeCase(data: Partial<CreateSubscriptionPlanRequest>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  if (data.name !== undefined) payload.name = data.name
  if (data.price !== undefined) payload.price = data.price
  if (data.frequency !== undefined) payload.frequency = data.frequency
  if (data.sortOrder !== undefined) payload.sort_order = data.sortOrder
  if (data.isHidden !== undefined) payload.is_hidden = data.isHidden
  if (data.isTrial !== undefined) payload.is_trial = data.isTrial
  if (data.trialDays !== undefined) payload.trial_days = data.trialDays
  if (data.numberOfDynamicQrcodes !== undefined)
    payload.number_of_dynamic_qrcodes = data.numberOfDynamicQrcodes
  if (data.numberOfScans !== undefined) payload.number_of_scans = data.numberOfScans
  if (data.numberOfCustomDomains !== undefined)
    payload.number_of_custom_domains = data.numberOfCustomDomains
  if (data.fileSizeLimit !== undefined) payload.file_size_limit = data.fileSizeLimit
  if (data.numberOfUsers !== undefined) payload.number_of_users = data.numberOfUsers
  if (data.numberOfRestaurantMenuItems !== undefined)
    payload.number_of_restaurant_menu_items = data.numberOfRestaurantMenuItems
  if (data.numberOfProductCatalogueItems !== undefined)
    payload.number_of_product_catalogue_items = data.numberOfProductCatalogueItems
  if (data.numberOfAiGenerations !== undefined)
    payload.number_of_ai_generations = data.numberOfAiGenerations
  if (data.numberOfBulkCreatedQrcodes !== undefined)
    payload.number_of_bulk_created_qrcodes = data.numberOfBulkCreatedQrcodes
  // Backend expects 'enabled'/'disabled' string, not boolean
  if (data.showAds !== undefined) payload.show_ads = data.showAds ? 'enabled' : 'disabled'
  if (data.adsTimeout !== undefined) payload.ads_timeout = data.adsTimeout
  if (data.adsCode !== undefined) payload.ads_code = data.adsCode
  if (data.qrTypes !== undefined) payload.qr_types = data.qrTypes
  if (data.unavailableTypesBehaviour !== undefined)
    payload.unavailable_types_behaviour = data.unavailableTypesBehaviour
  if (data.features !== undefined) payload.features = data.features
  if (data.checkpoints !== undefined) payload.checkpoints = data.checkpoints
  if (data.qrTypeLimits !== undefined) payload.qr_type_limits = data.qrTypeLimits
  if (data.hasApiAccess !== undefined) payload.has_api_access = data.hasApiAccess
  if (data.apiMonthlyRequests !== undefined) payload.api_monthly_requests = data.apiMonthlyRequests
  if (data.apiRateLimitPerMinute !== undefined)
    payload.api_rate_limit_per_minute = data.apiRateLimitPerMinute

  return payload
}

export const plansAPI = {
  // Get all subscription plans
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/subscription-plans', { params: mapSearchParams(params) })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API pagination response
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
    const response = await apiClient.post<SubscriptionPlan>(
      '/subscription-plans',
      toSnakeCase(data)
    )
    return response.data
  },

  // Update subscription plan
  update: async (id: number, data: Partial<CreateSubscriptionPlanRequest>) => {
    const response = await apiClient.put<SubscriptionPlan>(
      `/subscription-plans/${id}`,
      toSnakeCase(data)
    )
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

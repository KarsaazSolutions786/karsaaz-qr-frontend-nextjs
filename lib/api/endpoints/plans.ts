import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { SubscriptionPlan, CreateSubscriptionPlanRequest } from '@/types/entities/plan'

/**
 * Purpose: Map backend snake_case plan to frontend camelCase SubscriptionPlan.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: May 2026
 */

function mapPlan(raw: Record<string, unknown>): SubscriptionPlan {
  const r = raw as Record<string, unknown>
  return {
    ...(r as object),
    id: r.id as number,
    name: (r.name ?? '') as string,
    price: (r.price ?? 0) as number,
    frequency: (r.frequency ?? 'monthly') as SubscriptionPlan['frequency'],
    sortOrder: (r.sort_order ?? r.sortOrder ?? 0) as number,
    isHidden: (r.is_hidden ?? r.isHidden ?? false) as boolean,
    isTrial: (r.is_trial ?? r.isTrial ?? false) as boolean,
    trialDays: (r.trial_days ?? r.trialDays ?? 0) as number,
    numberOfDynamicQrcodes: (r.number_of_dynamic_qrcodes ?? r.numberOfDynamicQrcodes ?? 0) as number,
    numberOfScans: (r.number_of_scans ?? r.numberOfScans ?? 0) as number,
    numberOfCustomDomains: (r.number_of_custom_domains ?? r.numberOfCustomDomains ?? 0) as number,
    fileSizeLimit: (r.file_size_limit ?? r.fileSizeLimit ?? 0) as number,
    numberOfUsers: (r.number_of_users ?? r.numberOfUsers ?? 1) as number,
    numberOfRestaurantMenuItems:
      (r.number_of_restaurant_menu_items ?? r.numberOfRestaurantMenuItems ?? 0) as number,
    numberOfProductCatalogueItems:
      (r.number_of_product_catalogue_items ?? r.numberOfProductCatalogueItems ?? 0) as number,
    numberOfAiGenerations: (r.number_of_ai_generations ?? r.numberOfAiGenerations ?? 0) as number,
    numberOfBulkCreatedQrcodes:
      (r.number_of_bulk_created_qrcodes ?? r.numberOfBulkCreatedQrcodes ?? 0) as number,
    showAds: ((r.show_ads === 'enabled' || r.show_ads === true) || (r.showAds as boolean | undefined) || false) as boolean,
    adsTimeout: (r.ads_timeout ?? r.adsTimeout ?? 0) as number,
    adsCode: (r.ads_code ?? r.adsCode ?? '') as string,
    qrTypes: (r.qr_types ?? r.qrTypes ?? []) as string[],
    unavailableTypesBehaviour:
      (r.unavailable_types_behaviour ?? r.unavailableTypesBehaviour ?? 'show_upgrade_message') as string,
    features: (r.features ?? []) as SubscriptionPlan['features'],
    checkpoints: (r.checkpoints ?? []) as SubscriptionPlan['checkpoints'],
    qrTypeLimits: (r.qr_type_limits ?? r.qrTypeLimits ?? []) as SubscriptionPlan['qrTypeLimits'],
    hasApiAccess: (r.has_api_access ?? r.hasApiAccess ?? false) as boolean | undefined,
    apiMonthlyRequests: (r.api_monthly_requests ?? r.apiMonthlyRequests ?? 1000) as number,
    apiRateLimitPerMinute: (r.api_rate_limit_per_minute ?? r.apiRateLimitPerMinute ?? 60) as number,
    createdAt: (r.created_at ?? r.createdAt ?? '') as string,
    updatedAt: (r.updated_at ?? r.updatedAt ?? '') as string,
  }
}

/**
 * Purpose: Convert frontend camelCase plan data to backend snake_case for create/update.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
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
    const normalized = normalizePagination<Record<string, unknown>>(response.data)
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

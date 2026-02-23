import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { SubscriptionPlan, CreateSubscriptionPlanRequest } from '@/types/entities/plan'

export const plansAPI = {
  // Get all subscription plans
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/subscription-plans', { params: mapSearchParams(params) })
    return normalizePagination<SubscriptionPlan>(response.data)
  },

  // Get single subscription plan
  getById: async (id: number) => {
    const response = await apiClient.get<SubscriptionPlan>(`/subscription-plans/${id}`)
    return response.data
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

import apiClient from '../client'
import { normalizePagination } from '../pagination'

export interface AdminSubscription {
  id: number
  user_id: number
  subscription_plan_id: number
  user_name: string
  user_email: string
  subscription_plan_name: string
  expires_at: string | null
  created_at: string
  updated_at: string
  statuses: Array<{ id: number; status: string; created_at: string }>
}

export interface CreateAdminSubscriptionRequest {
  user_id: number
  subscription_plan_id: number
  subscription_status: string
  expires_at?: string | null
}

export const adminSubscriptionsAPI = {
  // Paginated list of all subscriptions (admin)
  getAll: async (params?: { page?: number; keyword?: string }) => {
    const response = await apiClient.get('/subscriptions', { params })
    return normalizePagination<AdminSubscription>(response.data)
  },

  // Single subscription (admin)
  getById: async (id: number) => {
    const response = await apiClient.get<AdminSubscription>(`/subscriptions/${id}`)
    return response.data
  },

  // Create subscription (admin)
  create: async (data: CreateAdminSubscriptionRequest) => {
    const response = await apiClient.post<AdminSubscription>('/subscriptions', data)
    return response.data
  },

  // Update subscription (admin)
  update: async (id: number, data: Partial<CreateAdminSubscriptionRequest>) => {
    const response = await apiClient.put<AdminSubscription>(`/subscriptions/${id}`, data)
    return response.data
  },

  // Delete pending subscriptions (bulk)
  deletePending: async () => {
    const response = await apiClient.post<{ deleted: number }>('/subscriptions/delete-pending')
    return response.data
  },

  // Get available subscription statuses
  getStatuses: async () => {
    const response = await apiClient.get<string[]>('/subscriptions/statuses')
    return Array.isArray(response.data) ? response.data : []
  },
}

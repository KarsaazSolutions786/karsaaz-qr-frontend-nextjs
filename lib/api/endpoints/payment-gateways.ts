import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { PaymentGateway } from '@/types/entities/payment-gateway'

export const paymentGatewaysAPI = {
  // List all payment gateways
  list: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/payment-gateways', { params: mapSearchParams(params) })
    return normalizePagination<PaymentGateway>(response.data)
  },

  // Get a single payment gateway
  getById: async (id: number) => {
    const response = await apiClient.get<PaymentGateway>(`/payment-gateways/${id}`)
    return response.data
  },

  // Create a new payment gateway
  create: async (data: Omit<PaymentGateway, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post<PaymentGateway>('/payment-gateways', data)
    return response.data
  },

  // Update a payment gateway
  update: async (
    id: number,
    data: Partial<Omit<PaymentGateway, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    const response = await apiClient.put<PaymentGateway>(`/payment-gateways/${id}`, data)
    return response.data
  },

  // Delete a payment gateway
  delete: async (id: number) => {
    const response = await apiClient.delete(`/payment-gateways/${id}`)
    return response.data
  },
}

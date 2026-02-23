import apiClient from '../client'
import { normalizePagination, mapSearchParams } from '../pagination'
import type { Currency, CreateCurrencyRequest } from '@/types/entities/currency'

export const currenciesAPI = {
  // Get all currencies
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/currencies', { params: mapSearchParams(params) })
    return normalizePagination<Currency>(response.data)
  },

  // Get single currency
  getById: async (id: number) => {
    const response = await apiClient.get<Currency>(`/currencies/${id}`)
    return response.data
  },

  // Create new currency
  create: async (data: CreateCurrencyRequest) => {
    const response = await apiClient.post<Currency>('/currencies', data)
    return response.data
  },

  // Update currency
  update: async (id: number, data: Partial<CreateCurrencyRequest>) => {
    const response = await apiClient.put<Currency>(`/currencies/${id}`, data)
    return response.data
  },

  // Delete currency
  delete: async (id: number) => {
    await apiClient.delete(`/currencies/${id}`)
  },

  // Enable/disable currency
  enable: async (id: number) => {
    const response = await apiClient.post<Currency>(`/currencies/${id}/enable`)
    return response.data
  },
}

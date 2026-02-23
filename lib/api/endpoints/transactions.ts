import apiClient from '../client'
import { normalizePagination, mapSearchParams, type PaginatedResponse } from '../pagination'
import type { Transaction } from '@/types/entities/transaction'

export type TransactionListResponse = PaginatedResponse<Transaction>

export const transactionsAPI = {
  // Get all transactions
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get('/transactions', { params: mapSearchParams(params) })
    return normalizePagination<Transaction>(response.data)
  },

  // Get single transaction
  getById: async (id: number) => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  // Approve transaction
  approve: async (id: number) => {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/approve`)
    return response.data
  },

  // Reject transaction
  reject: async (id: number) => {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/reject`)
    return response.data
  },
}

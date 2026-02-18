import apiClient from '../client'
import type { Transaction } from '@/types/entities/transaction'

export interface TransactionListResponse {
  data: Transaction[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export const transactionsAPI = {
  // Get all transactions
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<TransactionListResponse>('/transactions', { params })
    return response.data
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

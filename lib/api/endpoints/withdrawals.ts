import apiClient from '../client'
import type { WithdrawalRequest } from '@/types/entities/referral'

export interface WithdrawalListResponse {
  data: WithdrawalRequest[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface CreateWithdrawalData {
  amount: number
  payment_method: string
  payment_details: Record<string, string>
}

export const withdrawalsAPI = {
  // List withdrawal requests
  list: async (params?: { page?: number }) => {
    const response = await apiClient.get<WithdrawalListResponse>('/withdrawals', { params })
    return response.data
  },

  // Create a new withdrawal request
  create: async (data: CreateWithdrawalData) => {
    const response = await apiClient.post<WithdrawalRequest>('/withdrawals', data)
    return response.data
  },
}

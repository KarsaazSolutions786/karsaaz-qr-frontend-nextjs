import apiClient from '../client'

export interface CreditTransaction {
  id: number
  amount: number
  type: 'credit' | 'debit'
  description?: string
  created_at: string
}

export interface CreditHistoryResponse {
  data: CreditTransaction[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export const accountCreditsAPI = {
  getBalance: async (userId: number | string) => {
    const response = await apiClient.get<{ account_balance: number }>(`/users/${userId}/account-balance`)
    return response.data
  },

  getHistory: async (userId: number | string, params?: { page?: number }) => {
    const response = await apiClient.get<CreditHistoryResponse>(`/users/${userId}/transactions`, { params: { ...params, type: 'credit' } })
    return response.data
  },
}

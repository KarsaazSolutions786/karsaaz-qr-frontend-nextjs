import apiClient from '../client'
import type { Referral, ReferralStats } from '@/types/entities/referral'

export interface ReferralListResponse {
  data: Referral[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface ReferralCodeResponse {
  referral_code: string
}

export const referralAPI = {
  // Get referral statistics
  getStats: async () => {
    const response = await apiClient.get<ReferralStats>('/referrals/stats')
    return response.data
  },

  // Get the user's referral code
  getCode: async () => {
    const response = await apiClient.get<ReferralCodeResponse>('/referrals/code')
    return response.data
  },

  // List referred users
  list: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<ReferralListResponse>('/referrals', { params })
    return response.data
  },
}

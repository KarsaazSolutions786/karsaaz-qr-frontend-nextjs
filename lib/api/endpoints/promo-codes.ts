import apiClient from '../client'

export interface PromoCode {
  id: number
  code: string
  discount_percentage: number
  expires_at: string | null
  usage_limit: number | null
  times_used: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PromoCodeListResponse {
  data: PromoCode[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface CreatePromoCodeRequest {
  code: string
  discount_percentage: number
  expires_at?: string
  usage_limit?: number | null
  is_active?: boolean
}

export const promoCodesAPI = {
  list: async (params?: { page?: number; search?: string }): Promise<PromoCodeListResponse> => {
    try {
      const response = await apiClient.get<PromoCodeListResponse>('/promo-codes', {
        params,
        _silent: true,
      } as any)
      return response.data
    } catch {
      return { data: [], pagination: { total: 0, perPage: 15, currentPage: 1, lastPage: 1 } }
    }
  },

  getById: async (id: number) => {
    const response = await apiClient.get<PromoCode>(`/promo-codes/${id}`)
    return response.data
  },

  create: async (data: CreatePromoCodeRequest) => {
    const response = await apiClient.post<PromoCode>('/promo-codes', data)
    return response.data
  },

  update: async (id: number, data: Partial<CreatePromoCodeRequest>) => {
    const response = await apiClient.put<PromoCode>(`/promo-codes/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`/promo-codes/${id}`)
  },
}

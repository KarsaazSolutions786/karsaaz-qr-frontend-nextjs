import apiClient from '../client'
import type { Domain, DomainConnectivity, DomainStatus, DomainAvailability } from '@/types/entities/domain'

export interface DomainListResponse {
  data: Domain[]
  pagination?: {
    currentPage: number
    lastPage: number
    total: number
  }
}

export interface CreateDomainRequest {
  domain: string
}

export interface UpdateDomainRequest {
  domain?: string
  isDefault?: boolean
}

export const domainsAPI = {
  list: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<DomainListResponse>('/domains', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Domain>(`/domains/${id}`)
    return response.data
  },

  create: async (data: CreateDomainRequest) => {
    const response = await apiClient.post<Domain>('/domains', data)
    return response.data
  },

  update: async (id: string, data: UpdateDomainRequest) => {
    const response = await apiClient.put<Domain>(`/domains/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/domains/${id}`)
  },

  testConnection: async (id: string) => {
    const response = await apiClient.post<DomainConnectivity>(`/domains/${id}/test-connection`)
    return response.data
  },

  changeStatus: async (id: string, status: DomainStatus) => {
    const response = await apiClient.put<Domain>(`/domains/${id}/status`, { status })
    return response.data
  },

  /**
   * Update domain availability (public/private)
   * PUT /api/domains/{id}/update-availability
   */
  updateAvailability: async (id: string, availability: DomainAvailability) => {
    const response = await apiClient.put<Domain>(
      `/domains/${id}/update-availability`,
      { availability }
    )
    return response.data
  },

  /**
   * Set domain as the default domain for new QR codes
   * PUT /api/domains/{id}/set-default
   */
  setDefault: async (id: string) => {
    const response = await apiClient.put<Domain>(`/domains/${id}/set-default`)
    return response.data
  },
}

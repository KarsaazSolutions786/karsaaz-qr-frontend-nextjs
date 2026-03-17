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

/** Map backend snake_case domain response to frontend camelCase Domain type */
function transformDomain(raw: any): Domain {
  return {
    id: raw.id,
    userId: raw.user_id ?? raw.userId,
    domain: raw.host ?? raw.domain ?? '',
    status: raw.status ?? 'pending',
    availability: raw.availability,
    isDefault: raw.is_default ?? raw.isDefault ?? false,
    dnsRecords: (raw.dns_records ?? raw.dnsRecords ?? []).map((r: any) => ({
      type: r.type,
      name: r.name,
      value: r.value,
      status: r.status,
    })),
    verifiedAt: raw.verified_at ?? raw.verifiedAt,
    createdAt: raw.created_at ?? raw.createdAt,
    updatedAt: raw.updated_at ?? raw.updatedAt,
  }
}

export const domainsAPI = {
  list: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<any>('/domains', { params })
    const raw = response.data
    return {
      data: (raw.data ?? []).map(transformDomain),
      pagination: raw.pagination ?? raw.meta,
    } as DomainListResponse
  },

  getById: async (id: string) => {
    const response = await apiClient.get<any>(`/domains/${id}`)
    return transformDomain(response.data?.data ?? response.data)
  },

  create: async (data: CreateDomainRequest) => {
    const response = await apiClient.post<any>('/domains', { host: data.domain })
    return transformDomain(response.data?.data ?? response.data)
  },

  update: async (id: string, data: UpdateDomainRequest) => {
    const payload: Record<string, any> = {}
    if (data.domain !== undefined) payload.host = data.domain
    if (data.isDefault !== undefined) payload.is_default = data.isDefault
    const response = await apiClient.put<any>(`/domains/${id}`, payload)
    return transformDomain(response.data?.data ?? response.data)
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

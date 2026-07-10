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

type RawDomainRecord = { type: string; name: string; value: string; status: string }
type RawDomain = Record<string, unknown> & {
  id?: unknown
  user_id?: unknown; userId?: unknown
  host?: unknown; domain?: unknown
  status?: unknown
  availability?: unknown
  is_default?: unknown; isDefault?: unknown
  dns_records?: RawDomainRecord[]; dnsRecords?: RawDomainRecord[]
  verified_at?: unknown; verifiedAt?: unknown
  created_at?: unknown; createdAt?: unknown
  updated_at?: unknown; updatedAt?: unknown
}

function transformDomain(raw: RawDomain): Domain {
  return {
    id: raw.id as Domain['id'],
    userId: (raw.user_id ?? raw.userId) as Domain['userId'],
    domain: (raw.host ?? raw.domain ?? '') as string,
    status: (raw.status ?? 'pending') as Domain['status'],
    availability: raw.availability as Domain['availability'],
    isDefault: (raw.is_default ?? raw.isDefault ?? false) as boolean,
    dnsRecords: (raw.dns_records ?? raw.dnsRecords ?? []).map((r) => ({
      type: r.type as Domain['dnsRecords'][number]['type'],
      name: r.name,
      value: r.value,
      status: r.status as Domain['dnsRecords'][number]['status'],
    })),
    verifiedAt: (raw.verified_at ?? raw.verifiedAt) as string | undefined,
    createdAt: (raw.created_at ?? raw.createdAt) as string,
    updatedAt: (raw.updated_at ?? raw.updatedAt) as string,
  }
}

export const domainsAPI = {
  list: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<{ data: RawDomain[]; pagination?: unknown; meta?: unknown }>('/domains', { params })
    const raw = response.data
    return {
      data: (raw.data ?? []).map(transformDomain),
      pagination: raw.pagination ?? raw.meta,
    } as DomainListResponse
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data?: RawDomain } | RawDomain>(`/domains/${id}`)
    const raw = response.data as ({ data?: RawDomain } & RawDomain)
    return transformDomain(raw.data ?? raw)
  },

  create: async (data: CreateDomainRequest) => {
    const response = await apiClient.post<{ data?: RawDomain } | RawDomain>('/domains', { host: data.domain })
    const raw = response.data as ({ data?: RawDomain } & RawDomain)
    return transformDomain(raw.data ?? raw)
  },

  update: async (id: string, data: UpdateDomainRequest) => {
    const payload: Record<string, unknown> = {}
    if (data.domain !== undefined) payload.host = data.domain
    if (data.isDefault !== undefined) payload.is_default = data.isDefault
    const response = await apiClient.put<{ data?: RawDomain } | RawDomain>(`/domains/${id}`, payload)
    const raw = response.data as ({ data?: RawDomain } & RawDomain)
    return transformDomain(raw.data ?? raw)
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

  updateAvailability: async (id: string, availability: DomainAvailability) => {
    const response = await apiClient.put<Domain>(
      `/domains/${id}/update-availability`,
      { availability }
    )
    return response.data
  },

  setDefault: async (id: string) => {
    const response = await apiClient.put<Domain>(`/domains/${id}/set-default`)
    return response.data
  },
}

import apiClient from '../client'
import type {
  Biolink,
  BiolinksResponse,
  CreateBiolinkRequest,
  UpdateBiolinkRequest,
} from '@/types/entities/biolink'

export interface BiolinksAnalyticsResponse {
  biolinksId: string;
  totalViews: number;
  totalClicks: number;
  blockClicks: Record<string, number>;
  viewsByDate: Array<{ date: string; views: number }>;
  clicksByBlock: Array<{ blockId: string; blockType: string; clicks: number }>;
  topBlocks: Array<{ blockId: string; blockType: string; title?: string; clicks: number }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  locationBreakdown: Array<{ country: string; views: number }>;
}

export const biolinksAPI = {
  getAll: async (params?: {
    page?: number
    perPage?: number
    search?: string
  }): Promise<BiolinksResponse> => {
    try {
      const response = await apiClient.get('/biolinks', {
        params,
        _silent: true,
      } as any)
      return response.data
    } catch {
      return { data: [], pagination: { total: 0, perPage: 15, currentPage: 1, lastPage: 1 } } as any
    }
  },

  getById: async (id: number): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/${id}`)
    return response.data.data
  },

  getBySlug: async (slug: string): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/slug/${slug}`)
    return response.data.data
  },

  create: async (data: CreateBiolinkRequest): Promise<Biolink> => {
    const response = await apiClient.post('/biolinks', data)
    return response.data.data
  },

  update: async (data: UpdateBiolinkRequest): Promise<Biolink> => {
    const { id, ...updateData } = data
    const response = await apiClient.put(`/biolinks/${id}`, updateData)
    return response.data.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/biolinks/${id}`)
  },

  togglePublish: async (id: number, isPublished: boolean): Promise<Biolink> => {
    const response = await apiClient.patch(`/biolinks/${id}/publish`, {
      isPublished,
    })
    return response.data.data
  },

  getAnalytics: async (
    id: number,
    params?: {
      startDate?: string;
      endDate?: string;
      groupBy?: 'day' | 'week' | 'month';
    }
  ): Promise<BiolinksAnalyticsResponse> => {
    const response = await apiClient.get(`/biolinks/${id}/analytics`, { params })
    return response.data
  },

  trackView: async (
    biolinksId: string,
    metadata?: {
      userAgent?: string;
      referrer?: string;
      country?: string;
    }
  ): Promise<void> => {
    await apiClient.post(`/public/biolinks/${biolinksId}/track-view`, metadata)
  },

  trackBlockClick: async (
    biolinksId: string,
    blockId: string,
    metadata?: {
      userAgent?: string;
      referrer?: string;
    }
  ): Promise<void> => {
    await apiClient.post(`/public/biolinks/${biolinksId}/blocks/${blockId}/track-click`, metadata)
  },

  clone: async (id: number): Promise<Biolink> => {
    const response = await apiClient.post(`/biolinks/${id}/clone`)
    return response.data.data
  },

  export: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/biolinks/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },

  getTemplates: async (): Promise<Biolink[]> => {
    const response = await apiClient.get('/biolinks/templates')
    return response.data.data
  },

  createFromTemplate: async (templateId: string, qrCodeId: string): Promise<Biolink> => {
    const response = await apiClient.post('/biolinks/from-template', {
      templateId,
      qrCodeId,
    })
    return response.data.data
  },
}

export const biolinksKeys = {
  all: ['biolinks'] as const,
  lists: () => [...biolinksKeys.all, 'list'] as const,
  list: (filters: any) => [...biolinksKeys.lists(), filters] as const,
  details: () => [...biolinksKeys.all, 'detail'] as const,
  detail: (id: number) => [...biolinksKeys.details(), id] as const,
  analytics: (id: number) => [...biolinksKeys.detail(id), 'analytics'] as const,
  templates: () => [...biolinksKeys.all, 'templates'] as const,
}

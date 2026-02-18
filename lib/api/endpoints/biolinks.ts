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
  // Get all biolinks for the authenticated user
  getAll: async (params?: {
    page?: number
    perPage?: number
    search?: string
  }): Promise<BiolinksResponse> => {
    const response = await apiClient.get('/biolinks', { params })
    return response.data
  },

  // Get a single biolink by ID
  getById: async (id: number): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/${id}`)
    return response.data.data
  },

  // Get a biolink by slug (public view)
  getBySlug: async (slug: string): Promise<Biolink> => {
    const response = await apiClient.get(`/biolinks/slug/${slug}`)
    return response.data.data
  },

  // Create a new biolink
  create: async (data: CreateBiolinkRequest): Promise<Biolink> => {
    const response = await apiClient.post('/biolinks', data)
    return response.data.data
  },

  // Update an existing biolink
  update: async (data: UpdateBiolinkRequest): Promise<Biolink> => {
    const { id, ...updateData } = data
    const response = await apiClient.put(`/biolinks/${id}`, updateData)
    return response.data.data
  },

  // Delete a biolink
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/biolinks/${id}`)
  },

  // Publish/unpublish a biolink
  togglePublish: async (id: number, isPublished: boolean): Promise<Biolink> => {
    const response = await apiClient.patch(`/biolinks/${id}/publish`, {
      isPublished,
    })
    return response.data.data
  },

  // Get biolinks analytics
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

  // Track biolinks view (public endpoint)
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

  // Track block click (public endpoint)
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

  // Clone biolinks
  clone: async (id: number): Promise<Biolink> => {
    const response = await apiClient.post(`/biolinks/${id}/clone`)
    return response.data.data
  },

  // Export biolinks data
  export: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/biolinks/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Get biolinks templates
  getTemplates: async (): Promise<Biolink[]> => {
    const response = await apiClient.get('/biolinks/templates')
    return response.data.data
  },

  // Create biolinks from template
  createFromTemplate: async (templateId: string, qrCodeId: string): Promise<Biolink> => {
    const response = await apiClient.post('/biolinks/from-template', {
      templateId,
      qrCodeId,
    })
    return response.data.data
  },
}

// React Query keys for caching
export const biolinksKeys = {
  all: ['biolinks'] as const,
  lists: () => [...biolinksKeys.all, 'list'] as const,
  list: (filters: any) => [...biolinksKeys.lists(), filters] as const,
  details: () => [...biolinksKeys.all, 'detail'] as const,
  detail: (id: number) => [...biolinksKeys.details(), id] as const,
  analytics: (id: number) => [...biolinksKeys.detail(id), 'analytics'] as const,
  templates: () => [...biolinksKeys.all, 'templates'] as const,
}

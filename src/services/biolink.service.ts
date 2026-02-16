/**
 * Biolink API Service
 * Handles all API calls for biolink pages and blocks
 */

import { BiolinkPage, Block } from '@/components/qr/biolinks/types';
import apiClient from '@/lib/api-client';

interface CreateBiolinkPagePayload {
  title: string;
  slug: string;
  description?: string;
  theme: BiolinkPage['theme'];
  seo: BiolinkPage['seo'];
  settings: BiolinkPage['settings'];
}

interface UpdateBiolinkPagePayload extends Partial<CreateBiolinkPagePayload> {
  blocks?: Block[];
  stats?: BiolinkPage['stats'];
}

interface CreateBlockPayload {
  type: string;
  content: Record<string, unknown>;
  order: number;
}

interface UpdateBlockPayload {
  content?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  design?: Record<string, unknown>;
  order?: number;
}

export const biolinkService = {
  /**
   * Create a new biolink page
   */
  async createPage(payload: CreateBiolinkPagePayload): Promise<BiolinkPage> {
    const response = await apiClient.post('/biolinks', payload);
    return response as BiolinkPage;
  },

  /**
   * Get a biolink page by ID or slug
   */
  async getPage(idOrSlug: string): Promise<BiolinkPage> {
    const response = await apiClient.get(`/biolinks/${idOrSlug}`);
    return response as BiolinkPage;
  },

  /**
   * Update a biolink page
   */
  async updatePage(id: string, updates: UpdateBiolinkPagePayload): Promise<BiolinkPage> {
    const response = await apiClient.put(`/biolinks/${id}`, updates);
    return response as BiolinkPage;
  },

  /**
   * Delete a biolink page
   */
  async deletePage(id: string): Promise<void> {
    await apiClient.delete(`/biolinks/${id}`);
  },

  /**
   * Get all biolink pages (paginated)
   */
  async getAllPages(params?: {
    page?: number;
    search?: string;
  }): Promise<{
    pages: BiolinkPage[];
    total: number;
    per_page: number;
    current_page: number;
  }> {
    const response = await apiClient.get('/biolinks', params);
    return response as {
      pages: BiolinkPage[];
      total: number;
      per_page: number;
      current_page: number;
    };
  },

  // ---------- Block Operations ----------

  /**
   * Get all blocks for a biolink page
   */
  async getBlocks(pageId: string): Promise<Block[]> {
    const response = await apiClient.get(`/biolinks/${pageId}/blocks`);
    return response as Block[];
  },

  /**
   * Create a new block on a biolink page
   */
  async createBlock(pageId: string, payload: CreateBlockPayload): Promise<Block> {
    const response = await apiClient.post(`/biolinks/${pageId}/blocks`, payload);
    return response as Block;
  },

  /**
   * Update a block on a biolink page
   */
  async updateBlock(pageId: string, blockId: string, updates: UpdateBlockPayload): Promise<Block> {
    const response = await apiClient.put(`/biolinks/${pageId}/blocks/${blockId}`, updates);
    return response as Block;
  },

  /**
   * Delete a block from a biolink page
   */
  async deleteBlock(pageId: string, blockId: string): Promise<void> {
    await apiClient.delete(`/biolinks/${pageId}/blocks/${blockId}`);
  },

  /**
   * Reorder blocks on a biolink page
   */
  async reorderBlocks(pageId: string, blockIds: string[]): Promise<Block[]> {
    const response = await apiClient.post(`/biolinks/${pageId}/blocks/reorder`, {
      blockIds
    });
    return response as Block[];
  },

  // ---------- Page Settings ----------

  /**
   * Update page theme
   */
  async updateTheme(pageId: string, theme: BiolinkPage['theme']): Promise<BiolinkPage> {
    const response = await apiClient.put(`/biolinks/${pageId}/theme`, theme);
    return response as BiolinkPage;
  },

  /**
   * Update page SEO settings
   */
  async updateSeo(pageId: string, seo: BiolinkPage['seo']): Promise<BiolinkPage> {
    const response = await apiClient.put(`/biolinks/${pageId}/seo`, seo);
    return response as BiolinkPage;
  },

  /**
   * Update page settings
   */
  async updateSettings(pageId: string, settings: BiolinkPage['settings']): Promise<BiolinkPage> {
    const response = await apiClient.put(`/biolinks/${pageId}/settings`, settings);
    return response as BiolinkPage;
  },

  // ---------- Analytics ----------

  /**
   * Get biolink page analytics
   */
  async getAnalytics(pageId: string, params?: {
    from?: string;
    to?: string;
  }): Promise<{
    views: number;
    uniqueViews: number;
    blocks: {
      [blockId: string]: {
        views: number;
        clicks: number;
      };
    };
  }> {
    const response = await apiClient.get(`/biolinks/${pageId}/analytics`, params);
    return response as {
      views: number;
      uniqueViews: number;
      blocks: {
        [blockId: string]: {
          views: number;
          clicks: number;
        };
      };
    };
  },

  /**
   * Track a page view
   */
  async trackView(pageId: string): Promise<void> {
    // This would typically be called from the public page
    await apiClient.post(`/biolinks/${pageId}/views`, {});
  },

  /**
   * Track a block click/view
   */
  async trackBlockInteraction(pageId: string, blockId: string, type: 'view' | 'click'): Promise<void> {
    await apiClient.post(`/biolinks/${pageId}/blocks/${blockId}/interactions`, {
      type
    });
  },

  // ---------- Public ----------

  /**
   * Get public biolink page (no auth required)
   */
  async getPublicPage(slug: string): Promise<BiolinkPage> {
    const response = await apiClient.get(`/biolinks/public/${slug}`);
    return response as BiolinkPage;
  },

  /**
   * Track share for analytics
   */
  async trackShare(slug: string, platform: string): Promise<void> {
    await apiClient.post(`/biolinks/public/${slug}/shares`, {
      platform
    });
  }
};

export default biolinkService;

import apiClient from '../client';

export interface UsageStats {
  qr_codes: {
    used: number;
    limit: number;
  };
  scans: {
    used: number;
    limit: number;
  };
  storage: {
    used: number;
    limit: number;
  };
  team_members: {
    used: number;
    limit: number;
  };
}

export interface QuotaInfo {
  type: string;
  used: number;
  limit: number;
  percentage: number;
  resetDate?: string;
}

export interface UsageEvent {
  eventType: 'qr_created' | 'qr_scanned' | 'qr_downloaded' | 'template_used';
  data?: Record<string, any>;
  timestamp?: string;
}

export const usageApi = {
  async getUsageStats(): Promise<UsageStats> {
    const response = await apiClient.get('/usage/stats');
    return response.data;
  },

  async trackEvent(eventType: UsageEvent['eventType'], data?: Record<string, any>): Promise<void> {
    await apiClient.post('/usage/track', {
      eventType,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  async getQuotaInfo(quotaType?: string): Promise<QuotaInfo[]> {
    const params = quotaType ? { type: quotaType } : {};
    const response = await apiClient.get('/usage/quota', { params });
    return response.data;
  },

  async getUsageHistory(days: number = 30): Promise<any[]> {
    const response = await apiClient.get('/usage/history', {
      params: { days },
    });
    return response.data;
  },
};

export default usageApi;

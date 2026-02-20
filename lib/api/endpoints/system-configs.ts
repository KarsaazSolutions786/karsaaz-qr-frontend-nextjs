import apiClient from '../client'

export interface SystemConfig {
  key: string
  value: string | null
}

export const systemConfigsAPI = {
  /**
   * Fetch system configs by keys
   * GET /api/system/configs?keys=key1,key2,...
   */
  get: async (keys: string[]): Promise<SystemConfig[]> => {
    const response = await apiClient.get<SystemConfig[]>('/system/configs', {
      params: { keys: keys.join(',') },
    })
    return Array.isArray(response.data) ? response.data : []
  },

  /**
   * Save system configs
   * POST /api/system/configs
   * Body: [{ key, value }, ...]
   */
  save: async (configs: SystemConfig[]): Promise<void> => {
    await apiClient.post('/system/configs', configs)
  },
}

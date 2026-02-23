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

  /**
   * Upload a file for a system config
   * POST /api/system/configs/upload?key={name}
   */
  upload: async (key: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ url: string }>(
      `/system/configs/upload?key=${key}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  /**
   * Test SMTP connection by sending a test email
   * POST /api/system/test-smtp
   */
  testSmtp: async (data: {
    email: string
    subject: string
    message: string
  }): Promise<{ success: boolean; debug?: string }> => {
    const response = await apiClient.post<{
      success: boolean
      debug?: string
    }>('/system/test-smtp', data)
    return response.data
  },

  /**
   * Test storage connection (S3/local)
   * POST /api/system/test-storage
   */
  testStorage: async (): Promise<{
    success: boolean
    message?: string
  }> => {
    const response = await apiClient.post<{
      success: boolean
      message?: string
    }>('/system/test-storage')
    return response.data
  },

  /**
   * Clear application cache
   * POST /api/system/clear-cache/{type}
   */
  clearCache: async (
    type: string
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.post<{
      success: boolean
      message?: string
    }>(`/system/clear-cache/${type}`)
    return response.data
  },

  /**
   * Rebuild application cache
   * POST /api/system/rebuild-cache/{type}
   */
  rebuildCache: async (
    type: string
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.post<{
      success: boolean
      message?: string
    }>(`/system/rebuild-cache/${type}`)
    return response.data
  },

  /**
   * Get system logs
   * GET /api/system/logs
   */
  getLogs: async (): Promise<{
    content: string
    size: number
  }> => {
    const response = await apiClient.get<{ content: string; size: number }>(
      '/system/logs'
    )
    return response.data
  },

  /**
   * Download log file
   * POST /api/system/log-file
   */
  downloadLogFile: async (): Promise<Blob> => {
    const response = await apiClient.post('/system/log-file', null, {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Clear log file
   * DELETE /api/system/log-file
   */
  clearLogFile: async (): Promise<void> => {
    await apiClient.delete('/system/log-file')
  },
}

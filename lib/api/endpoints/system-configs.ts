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
    try {
      const response = await apiClient.get<SystemConfig[]>('/system/configs', {
        params: { keys: keys.join(',') },
        _silent: true, // Suppress toast — non-admin users may lack system.settings permission
      } as any)
      return Array.isArray(response.data) ? response.data : []
    } catch {
      // Gracefully return empty on 403/500 (non-admin user or missing config)
      return []
    }
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
   * Backend returns { data: base64_encoded_string, size: "58.11 MB" }
   */
  getLogs: async (): Promise<{
    content: string
    size: number
  }> => {
    const response = await apiClient.get<{ data: string; size: string }>(
      '/system/logs'
    )
    const { data, size } = response.data
    // Decode base64 log content
    const content = data ? atob(data) : ''
    // Parse formatted size string (e.g. "58.11 MB") to bytes
    const sizeStr = size || '0 B'
    const units: Record<string, number> = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 }
    const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB)/)
    const sizeBytes = match ? parseFloat(match[1]!) * (units[match[2]!] || 1) : 0
    return { content, size: sizeBytes }
  },

  /**
   * Download log file
   * POST /api/system/log-file
   * Backend returns { url: "/api/system/log-file?signature=..." }
   */
  downloadLogFile: async (): Promise<string> => {
    const response = await apiClient.post<{ url: string }>('/system/log-file')
    return response.data.url
  },

  /**
   * Clear log file
   * DELETE /api/system/log-file
   */
  clearLogFile: async (): Promise<void> => {
    await apiClient.delete('/system/log-file')
  },
}

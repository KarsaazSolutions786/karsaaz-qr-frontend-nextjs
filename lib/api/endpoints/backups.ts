import apiClient from '../client'

export interface Backup {
  id: number
  filename: string
  size: string
  type: 'full' | 'db-only'
  status: 'completed' | 'in_progress' | 'failed'
  created_at: string
  download_url?: string
}

export const backupsAPI = {
  list: async (): Promise<Backup[]> => {
    const response = await apiClient.get<Backup[]>('/system/backups')
    return response.data
  },

  create: async (type: 'full' | 'db-only'): Promise<Backup> => {
    const response = await apiClient.post<Backup>('/system/backups/create', { type })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/system/backups/${id}`)
  },

  download: async (id: number): Promise<string> => {
    const response = await apiClient.get<{ url: string }>(`/system/backups/${id}/download`)
    return response.data.url
  },
}

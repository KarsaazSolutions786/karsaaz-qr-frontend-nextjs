import apiClient from '../client'

export interface QueueStats {
  pending: number
  processing: number
  failed: number
  completed: number
}

export interface FailedJob {
  id: number
  queue: string
  payload: string
  exception: string
  failed_at: string
}

export const queuesAPI = {
  stats: async (): Promise<QueueStats> => {
    const response = await apiClient.get<QueueStats>('/system/queues/stats')
    return response.data
  },

  failed: async (): Promise<FailedJob[]> => {
    const response = await apiClient.get<FailedJob[]>('/system/queues/failed')
    return response.data
  },

  retry: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/system/queues/failed/${id}/retry`)
    return response.data
  },

  deleteJob: async (id: number): Promise<void> => {
    await apiClient.delete(`/system/queues/failed/${id}`)
  },
}

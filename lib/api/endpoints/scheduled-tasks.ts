import apiClient from '../client'

export interface ScheduledTask {
  id: number
  name: string
  schedule: string
  last_run_at: string | null
  next_run_at: string | null
  is_enabled: boolean
  status: 'idle' | 'running' | 'failed'
  updated_at: string
}

export const scheduledTasksAPI = {
  list: async (): Promise<ScheduledTask[]> => {
    const response = await apiClient.get<ScheduledTask[]>('/system/scheduled-tasks')
    return response.data
  },

  run: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/system/scheduled-tasks/${id}/run`)
    return response.data
  },

  update: async (id: number, data: Partial<ScheduledTask>): Promise<ScheduledTask> => {
    const response = await apiClient.put<ScheduledTask>(`/system/scheduled-tasks/${id}`, data)
    return response.data
  },
}

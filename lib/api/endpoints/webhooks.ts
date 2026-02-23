import apiClient from '../client'

export interface Webhook {
  id: number
  url: string
  events: string[]
  secret_key?: string
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
  updated_at: string
}

export interface WebhookPayload {
  url: string
  events: string[]
  secret_key?: string
  is_active?: boolean
}

export const webhooksAPI = {
  list: async (): Promise<Webhook[]> => {
    const response = await apiClient.get<Webhook[]>('/system/webhooks')
    return response.data
  },

  create: async (data: WebhookPayload): Promise<Webhook> => {
    const response = await apiClient.post<Webhook>('/system/webhooks', data)
    return response.data
  },

  update: async (id: number, data: Partial<WebhookPayload>): Promise<Webhook> => {
    const response = await apiClient.put<Webhook>(`/system/webhooks/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/system/webhooks/${id}`)
  },

  test: async (id: number): Promise<{ success: boolean; status_code: number }> => {
    const response = await apiClient.post(`/system/webhooks/${id}/test`)
    return response.data
  },
}

import apiClient from '../client'

export interface EmailTemplate {
  id: number
  name: string
  subject: string
  html_body: string
  updated_at: string
}

export const emailTemplatesAPI = {
  list: async (): Promise<EmailTemplate[]> => {
    const response = await apiClient.get<EmailTemplate[]>('/system/email-templates')
    return response.data
  },

  update: async (id: number, data: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const response = await apiClient.put<EmailTemplate>(`/system/email-templates/${id}`, data)
    return response.data
  },
}

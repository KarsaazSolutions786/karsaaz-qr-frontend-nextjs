import apiClient from '../client'

export interface BannerSettings {
  enabled: boolean
  type: 'info' | 'warning' | 'success' | 'promo'
  content: string
  dismissible: boolean
  link_url?: string
  link_text?: string
  background_color?: string
  text_color?: string
}

export const bannerApi = {
  getSettings: async (): Promise<BannerSettings> => {
    const response = await apiClient.get<BannerSettings>('/admin/settings/banner')
    return response.data
  },

  updateSettings: async (settings: Partial<BannerSettings>): Promise<BannerSettings> => {
    const response = await apiClient.put<BannerSettings>('/admin/settings/banner', settings)
    return response.data
  },
}

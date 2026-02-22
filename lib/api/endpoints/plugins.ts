import apiClient from '../client'

export interface PluginConfig {
  key: string
  expandedKey?: string
  title: string
  instructions?: string
  type: 'text' | 'textarea' | 'file' | 'code' | 'number' | 'balloon-selector' | 'review-sites' | 'form-builder'
  value?: string
  placeholder?: string
  extra?: Record<string, unknown>
}

export interface PluginInfo {
  slug: string
  name: string
  description?: string
  tags?: string[]
  price?: string
  show_settings_link?: boolean
  configs?: PluginConfig[]
}

export interface AvailablePlugin {
  slug: string
  name: string
  description: string
  tags: string[]
  price: string
}

export const pluginsAPI = {
  getInstalled: async () => {
    const response = await apiClient.get<PluginInfo[]>('/plugins/installed')
    return response.data
  },

  getDetails: async (slug: string) => {
    const response = await apiClient.get<PluginInfo>(`/plugins/plugin/${slug}`)
    return response.data
  },

  saveConfig: async (configs: Record<string, string>) => {
    const response = await apiClient.post('/system/configs', configs)
    return response.data
  },
}

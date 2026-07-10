import apiClient from '@/lib/api/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface GuestSession {
  id: number
  session_token: string
  platform: 'web' | 'ios' | 'android'
  expires_at: string
  last_active_at: string
  created_at: string
}

export interface GuestConfiguration {
  is_guest_mode_enabled: boolean
  allowed_qr_types: string[]
  max_qrcodes_per_session: number
  max_scans_per_session: number
  max_downloads_per_session: number
  session_expiry_days: number
  allow_dynamic_qrcodes: boolean
  allow_design_customization: boolean
  allow_logo_upload: boolean
  allow_scanner: boolean
  allow_scan_history: boolean
  allowed_export_formats: string[]
  max_file_size_kb: number
  storage_quota_bytes: number
  show_signup_prompt_after: number
  signup_prompt_message: string | null
  watermark_enabled: boolean
  watermark_text: string
  allowed_design_features: string[]
  data_migration_on_signup: boolean
}

export interface GuestSessionInfo {
  session: GuestSession
  limits: {
    qrcodes: { used: number; max: number; remaining: number }
    scans: { used: number; max: number; remaining: number }
    downloads: { used: number; max: number; remaining: number }
  }
  configuration: GuestConfiguration
}

export interface GuestQrcode {
  id: number
  name: string
  type: string
  data: Record<string, any>
  design: Record<string, any>
  file_path: string | null
  is_static: boolean
  download_count: number
  created_at: string
  updated_at: string
}

export interface CreateGuestQrcodeRequest {
  name: string
  type: string
  data: Record<string, any>
  design?: Record<string, any>
  is_static?: boolean
}

export interface GuestScan {
  id: number
  scanned_data: string
  scanned_type: string
  created_at: string
}

export interface GuestAnalytics {
  period_days: number
  summary: {
    total_sessions: number
    active_sessions: number
    converted_sessions: number
    expired_sessions: number
    conversion_rate: number
  }
  popular_qr_types: { type: string; count: number }[]
  activity_breakdown: { action: string; count: number }[]
  platform_breakdown: { platform: string; count: number }[]
  daily_trend: { date: string; sessions: number }[]
}

type GuestRequestConfig = { headers?: Record<string, string>; _silent?: boolean }

export function getGuestHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('guest_session_token')
  return token ? { 'X-Guest-Session-Token': token } : {}
}

// ── Guest API (uses X-Guest-Session-Token) ─────────────────────────────────────

export const guestAPI = {
  // Configuration (public, no token needed)
  getConfiguration: async () => {
    const response = await apiClient.get<{ data: GuestConfiguration }>('/guest/configuration', {
      _silent: true,
    } as GuestRequestConfig)
    return (response.data as any).data ?? response.data
  },

  // Session management
  createSession: async (platform: 'web' | 'ios' | 'android' = 'web') => {
    const response = await apiClient.post<{ data: GuestSessionInfo }>(
      '/guest/session',
      { platform },
      { _silent: true } as GuestRequestConfig
    )
    const info = (response.data as any).data ?? response.data
    return info
  },

  getSession: async (): Promise<GuestSessionInfo> => {
    const response = await apiClient.get<{ data: GuestSessionInfo }>('/guest/session', {
      headers: getGuestHeaders(),
      _silent: true,
    } as GuestRequestConfig)
    return (response.data as any).data ?? response.data
  },

  endSession: async () => {
    const response = await apiClient.delete('/guest/session', {
      headers: getGuestHeaders(),
    })
    return response.data
  },

  // QR Codes
  createQrcode: async (data: CreateGuestQrcodeRequest) => {
    const response = await apiClient.post<{ data: GuestQrcode }>('/guest/qrcodes', data, {
      headers: getGuestHeaders(),
    })
    return (response.data as any).data ?? response.data
  },

  listQrcodes: async (): Promise<GuestQrcode[]> => {
    const response = await apiClient.get<{ data: GuestQrcode[] }>('/guest/qrcodes', {
      headers: getGuestHeaders(),
    })
    return (response.data as any).data ?? response.data
  },

  getQrcode: async (id: number) => {
    const response = await apiClient.get<{ data: GuestQrcode }>(`/guest/qrcodes/${id}`, {
      headers: getGuestHeaders(),
    })
    return (response.data as any).data ?? response.data
  },

  deleteQrcode: async (id: number) => {
    const response = await apiClient.delete(`/guest/qrcodes/${id}`, {
      headers: getGuestHeaders(),
    })
    return response.data
  },

  downloadQrcode: async (id: number, format?: string) => {
    const response = await apiClient.post(
      `/guest/qrcodes/${id}/download`,
      { format },
      { headers: getGuestHeaders(), responseType: 'blob' }
    )
    return response.data
  },

  previewQrcode: async (data: {
    type: string
    data: Record<string, any>
    design?: Record<string, any>
  }) => {
    const response = await apiClient.post('/guest/qrcodes/preview', data, {
      headers: getGuestHeaders(),
      responseType: 'blob',
    })
    return response.data
  },

  // Scans
  recordScan: async (data: { scanned_data: string; scanned_type: string }) => {
    const response = await apiClient.post<{ data: GuestScan }>('/guest/scans', data, {
      headers: getGuestHeaders(),
    })
    return (response.data as any).data ?? response.data
  },

  listScans: async (): Promise<GuestScan[]> => {
    const response = await apiClient.get<{ data: GuestScan[] }>('/guest/scans', {
      headers: getGuestHeaders(),
    })
    return (response.data as any).data ?? response.data
  },
}

// ── Admin Guest API (uses normal auth cookie) ──────────────────────────────────

export const adminGuestAPI = {
  getConfiguration: async (): Promise<GuestConfiguration> => {
    const response = await apiClient.get<{ data: GuestConfiguration }>('/admin/guest-configuration')
    return (response.data as any).data ?? response.data
  },

  updateConfiguration: async (data: Partial<GuestConfiguration>) => {
    const response = await apiClient.put<{ data: GuestConfiguration }>(
      '/admin/guest-configuration',
      data
    )
    return (response.data as any).data ?? response.data
  },

  getAnalytics: async (params?: { days?: number }): Promise<GuestAnalytics> => {
    const response = await apiClient.get<{ data: GuestAnalytics }>('/admin/guest-analytics', {
      params,
    })
    return (response.data as any).data ?? response.data
  },
}

import apiClient from '../client'

// ── API Tokens ──────────────────────────────────────────────
export interface ApiToken {
  id: number
  token_masked: string
  last_used_at: string | null
  created_at: string
}

export const apiTokensAPI = {
  list: async (userId: number | string) => {
    const response = await apiClient.get<{ data: ApiToken[] }>(`/users/${userId}/api-tokens`)
    return response.data
  },
  generate: async (userId: number | string) => {
    const response = await apiClient.post<{ data: ApiToken & { token: string } }>(`/users/${userId}/api-tokens`)
    return response.data
  },
  revoke: async (userId: number | string, tokenId: number) => {
    const response = await apiClient.delete(`/users/${userId}/api-tokens/${tokenId}`)
    return response.data
  },
}

// ── Two-Factor Authentication ───────────────────────────────
export interface TwoFactorStatus {
  enabled: boolean
  confirmed_at: string | null
}

export interface TwoFactorSetup {
  qr_code_svg: string
  secret: string
}

export const twoFactorAPI = {
  status: async (userId: number | string) => {
    const response = await apiClient.get<TwoFactorStatus>(`/users/${userId}/2fa/status`)
    return response.data
  },
  enable: async (userId: number | string) => {
    const response = await apiClient.post<TwoFactorSetup>(`/users/${userId}/2fa/enable`)
    return response.data
  },
  confirm: async (userId: number | string, code: string) => {
    const response = await apiClient.post(`/users/${userId}/2fa/confirm`, { code })
    return response.data
  },
  disable: async (userId: number | string, password: string) => {
    const response = await apiClient.post(`/users/${userId}/2fa/disable`, { password })
    return response.data
  },
  recoveryCodes: async (userId: number | string) => {
    const response = await apiClient.get<{ data: string[] }>(`/users/${userId}/2fa/recovery-codes`)
    return response.data
  },
}

// ── Notification Preferences ────────────────────────────────
export interface NotificationPreferences {
  email_notifications: boolean
  marketing_emails: boolean
  security_alerts: boolean
  product_updates: boolean
  weekly_digest: boolean
}

export const notificationPrefsAPI = {
  get: async (userId: number | string) => {
    const response = await apiClient.get<NotificationPreferences>(`/users/${userId}/notification-preferences`)
    return response.data
  },
  update: async (userId: number | string, prefs: Partial<NotificationPreferences>) => {
    const response = await apiClient.put<NotificationPreferences>(`/users/${userId}/notification-preferences`, prefs)
    return response.data
  },
}

// ── Activity Log ────────────────────────────────────────────
export interface ActivityLogEntry {
  id: number
  action: string
  ip_address: string
  user_agent: string
  created_at: string
}

export interface ActivityLogResponse {
  data: ActivityLogEntry[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const activityLogAPI = {
  list: async (userId: number | string, page = 1) => {
    const response = await apiClient.get<ActivityLogResponse>(`/users/${userId}/activity-log`, { params: { page } })
    return response.data
  },
}

// ── Sessions ────────────────────────────────────────────────
export interface UserSession {
  id: string
  ip_address: string
  user_agent: string
  last_active_at: string
  is_current: boolean
}

export const sessionsAPI = {
  list: async (userId: number | string) => {
    const response = await apiClient.get<{ data: UserSession[] }>(`/users/${userId}/sessions`)
    return response.data
  },
  revoke: async (userId: number | string, sessionId: string) => {
    const response = await apiClient.delete(`/users/${userId}/sessions/${sessionId}`)
    return response.data
  },
  revokeAllOthers: async (userId: number | string) => {
    const response = await apiClient.delete(`/users/${userId}/sessions`, { params: { except_current: true } })
    return response.data
  },
}

// ── Checkout / Tax ──────────────────────────────────────────
export interface TaxCalculation {
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  country: string
  state?: string
}

export const checkoutAPI = {
  calculateTax: async (data: { plan_id: number; country: string; state?: string }) => {
    const response = await apiClient.post<TaxCalculation>('/checkout/calculate-tax', data)
    return response.data
  },
}

// ── Subscription Plan Change ────────────────────────────────
export interface PlanChangePreview {
  current_plan: { id: number; name: string; price: number }
  new_plan: { id: number; name: string; price: number }
  prorated_amount: number
  effective_date: string
  is_upgrade: boolean
}

export const planChangeAPI = {
  preview: async (newPlanId: number) => {
    const response = await apiClient.post<PlanChangePreview>('/subscriptions/change-plan/preview', { new_plan_id: newPlanId })
    return response.data
  },
  execute: async (newPlanId: number) => {
    const response = await apiClient.post('/subscriptions/change-plan', { new_plan_id: newPlanId })
    return response.data
  },
}

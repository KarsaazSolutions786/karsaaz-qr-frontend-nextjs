import apiClient from '@/lib/api/client'

/**
 * Cloud Storage API Endpoints
 * 
 * Matches backend routes in: routes/api.php (cloud-storage prefix)
 * Providers: Google Drive, Dropbox, OneDrive, MEGA
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'mega'

export interface CloudConnection {
  id: string
  provider: CloudProvider
  name: string
  email?: string
  status: 'connected' | 'expired' | 'error'
  connected_at: string
  last_used_at?: string
  storage_used?: number
  storage_total?: number
  created_at: string
  updated_at: string
}

export interface BackupJob {
  id: string
  connection_id: string
  provider: CloudProvider
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  format?: string
  files_count?: number
  size_bytes?: number
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface AuthUrlResponse {
  url: string
}

export interface OAuthCallbackData {
  code: string
  state?: string
}

export interface MegaCredentials {
  email: string
  password: string
}

export interface CreateBackupData {
  connection_id: string
  format?: 'json' | 'csv' | 'zip'
  include_images?: boolean
  include_analytics?: boolean
}

export interface TestConnectionResult {
  success: boolean
  message?: string
  storage_used?: number
  storage_total?: number
}

// ─── API ────────────────────────────────────────────────────────────────

export const cloudStorageAPI = {
  // ── Connections ─────────────────────────────────────────────────────

  /** List all connected cloud storage providers */
  getConnections: async (): Promise<CloudConnection[]> => {
    const response = await apiClient.get<CloudConnection[] | { data: CloudConnection[] }>('/cloud-storage/connections')
    const body = response.data
    return Array.isArray(body) ? body : ((body as { data: CloudConnection[] }).data ?? [])
  },

  /** Get a single connection by ID */
  getConnection: async (id: string) => {
    const response = await apiClient.get<CloudConnection>(`/cloud-storage/connections/${id}`)
    return response.data
  },

  /** Delete / disconnect a cloud storage connection */
  deleteConnection: async (id: string) => {
    await apiClient.delete(`/cloud-storage/connections/${id}`)
  },

  /** Test an existing connection */
  testConnection: async (id: string) => {
    const response = await apiClient.post<TestConnectionResult>(`/cloud-storage/connections/${id}/test`)
    return response.data
  },

  // ── OAuth Providers (Google Drive, Dropbox, OneDrive) ──────────────

  /** Get OAuth authorization URL for a provider */
  getAuthUrl: async (provider: Exclude<CloudProvider, 'mega'>) => {
    const response = await apiClient.post<AuthUrlResponse>(`/cloud-storage/${provider}/auth-url`)
    return response.data
  },

  /** Handle OAuth callback after user authorizes */
  handleCallback: async (provider: Exclude<CloudProvider, 'mega'>, data: OAuthCallbackData) => {
    const response = await apiClient.post<CloudConnection>(`/cloud-storage/${provider}/callback`, data)
    return response.data
  },

  /** Refresh an expired OAuth token */
  refreshToken: async (provider: Exclude<CloudProvider, 'mega'>) => {
    const response = await apiClient.post<CloudConnection>(`/cloud-storage/${provider}/refresh`)
    return response.data
  },

  // ── MEGA (credential-based) ────────────────────────────────────────

  /** Connect to MEGA using email/password */
  connectMega: async (credentials: MegaCredentials) => {
    const response = await apiClient.post<CloudConnection>('/cloud-storage/mega/connect', credentials)
    return response.data
  },

  /** Test MEGA connection */
  testMega: async () => {
    const response = await apiClient.post<TestConnectionResult>('/cloud-storage/mega/test')
    return response.data
  },

  // ── Backup Jobs ────────────────────────────────────────────────────

  /** List all backup jobs */
  getBackupJobs: async (): Promise<BackupJob[]> => {
    const response = await apiClient.get<BackupJob[] | { data: BackupJob[] }>('/cloud-storage/backup-jobs')
    const body = response.data
    return Array.isArray(body) ? body : ((body as { data: BackupJob[] }).data ?? [])
  },

  /** Get a single backup job */
  getBackupJob: async (id: string) => {
    const response = await apiClient.get<BackupJob>(`/cloud-storage/backup-jobs/${id}`)
    return response.data
  },

  /** Start a new backup */
  createBackup: async (data: CreateBackupData) => {
    const response = await apiClient.post<BackupJob>('/cloud-storage/backup', data)
    return response.data
  },

  /** Delete a backup job */
  deleteBackupJob: async (id: string) => {
    await apiClient.delete(`/cloud-storage/backup-jobs/${id}`)
  },
}

import apiClient from '@/lib/api/client'

/**
 * Cloud Storage API Endpoints
 * 
 * Matches backend routes in: routes/api.php (cloud-storage prefix)
 * Providers: Google Drive, Dropbox, OneDrive, MEGA
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'mega'

/**
 * Backend connection status fields:
 * - is_active: Whether the connection is currently active
 * - is_token_expired: Whether OAuth token has expired (OAuth providers only)
 * 
 * The frontend derives display status from these:
 * - "connected" when is_active && !is_token_expired
 * - "expired" when is_token_expired
 * - "inactive" when !is_active
 */
export interface CloudConnection {
  id: string
  provider: CloudProvider
  name?: string
  // Backend uses account_email, some responses may use email
  account_email?: string
  email?: string
  // Backend status fields
  is_active: boolean
  is_token_expired: boolean
  // Legacy status field for backward compatibility
  status?: 'connected' | 'expired' | 'error'
  label?: string
  connected_at?: string
  last_used_at?: string
  storage_used?: number
  storage_total?: number
  created_at: string
  updated_at?: string
}

/**
 * Backup job status from backend:
 * - pending: Job created, not yet started
 * - processing: Currently backing up QR codes
 * - completed: All QR codes processed successfully
 * - failed: Error occurred during backup
 * - cancelled: User cancelled the backup
 */
export type BackupJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
// Also support legacy 'in_progress' status
export type BackupJobStatusLegacy = BackupJobStatus | 'in_progress'

export interface BackupJob {
  id: string
  connection_id?: string
  provider: CloudProvider
  status: BackupJobStatusLegacy
  format?: 'json' | 'zip'
  // Backend fields for progress tracking
  total_qr_codes?: number
  processed_qr_codes?: number
  progress?: number // 0-100 percentage
  progress_percentage?: number // alternative progress field
  // Legacy field names
  files_count?: number
  file_size?: number
  size_bytes?: number
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  updated_at?: string
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

/**
 * CreateBackupData per CLOUD_STORAGE_DOCUMENTATION.md Section 10:
 * - connection_id: Selected connection ID (required)
 * - format: "json" or "zip" (default: json)
 * - include_designs: Include QR code design data (default: true)
 * - include_analytics: Include scan analytics (default: true)
 * - include_images: Include SVG + PNG images (default: false)
 * - qr_code_ids: Optional array of specific QR code IDs (omit for all)
 */
export interface CreateBackupData {
  connection_id: string
  format?: 'json' | 'zip'
  include_designs?: boolean
  include_analytics?: boolean
  include_images?: boolean
  qr_code_ids?: number[] | string[]
}

export interface TestConnectionResult {
  success: boolean
  message?: string
  is_valid?: boolean // Backend may return this instead of success
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
  getAuthUrl: async (provider: Exclude<CloudProvider, 'mega'>): Promise<AuthUrlResponse> => {
    const response = await apiClient.post<AuthUrlResponse | { data: AuthUrlResponse }>(`/cloud-storage/${provider}/auth-url`)
    const body = response.data
    // Handle both { url: "..." } and { data: { url: "..." } } formats
    if ('data' in body && body.data && 'url' in body.data) {
      return body.data as AuthUrlResponse
    }
    return body as AuthUrlResponse
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
  getBackupJob: async (id: string): Promise<BackupJob> => {
    const response = await apiClient.get<BackupJob | { data: BackupJob }>(`/cloud-storage/backup-jobs/${id}`)
    const body = response.data
    // Handle both { ...job } and { data: { ...job } } formats
    if ('data' in body && body.data && typeof body.data === 'object') {
      return body.data as BackupJob
    }
    return body as BackupJob
  },

  /** Start a new backup */
  createBackup: async (data: CreateBackupData): Promise<BackupJob> => {
    const response = await apiClient.post<BackupJob | { data: BackupJob } | { id: string }>('/cloud-storage/backup', data)
    const body = response.data
    // Handle { data: { id: ... } }, { id: ... }, or full job response
    if ('data' in body && body.data && typeof body.data === 'object') {
      return body.data as BackupJob
    }
    return body as BackupJob
  },

  /** Cancel/delete a backup job */
  cancelBackupJob: async (id: string) => {
    await apiClient.delete(`/cloud-storage/backup-jobs/${id}`)
  },

  /** @deprecated Use cancelBackupJob instead */
  deleteBackupJob: async (id: string) => {
    await apiClient.delete(`/cloud-storage/backup-jobs/${id}`)
  },
}

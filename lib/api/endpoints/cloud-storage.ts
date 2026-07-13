import apiClient from '@/lib/api/client'

export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'mega'
export interface CloudConnection {
  id: string
  provider: CloudProvider
  name?: string
  account_email?: string
  email?: string
  is_active: boolean
  is_token_expired: boolean
  status?: 'connected' | 'expired' | 'error'
  label?: string
  connected_at?: string
  last_used_at?: string
  storage_used?: number
  storage_total?: number
  created_at: string
  updated_at?: string
}

export type BackupJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type BackupJobStatusLegacy = BackupJobStatus | 'in_progress'

export interface BackupJob {
  id: string
  connection_id?: string
  provider: CloudProvider
  status: BackupJobStatusLegacy
  format?: 'json' | 'zip'
  total_qr_codes?: number
  processed_qr_codes?: number
  progress?: number // 0-100 percentage
  progress_percentage?: number
  files_count?: number
  file_size?: number
  size_bytes?: number
  started_at?: string
  completed_at?: string
  error_message?: string
  is_stale?: boolean
  stale_message?: string
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
  is_valid?: boolean
  storage_used?: number
  storage_total?: number
}


export const cloudStorageAPI = {
  getConnections: async (): Promise<CloudConnection[]> => {
    const response = await apiClient.get<CloudConnection[] | { data: CloudConnection[] }>(
      '/cloud-storage/connections'
    )
    const body = response.data
    return Array.isArray(body) ? body : ((body as { data: CloudConnection[] }).data ?? [])
  },

  getConnection: async (id: string) => {
    const response = await apiClient.get<CloudConnection>(`/cloud-storage/connections/${id}`)
    return response.data
  },
  deleteConnection: async (id: string) => {
    await apiClient.delete(`/cloud-storage/connections/${id}`)
  },
  updateConnection: async (
    id: string,
    data: {
      provider?: string
      name?: string
      access_key?: string
      secret_key?: string
      bucket?: string
      region?: string
    }
  ) => {
    const response = await apiClient.put(`/cloud-storage/connections/${id}`, data)
    return response.data
  },
  testConnection: async (id: string) => {
    const response = await apiClient.post<TestConnectionResult>(
      `/cloud-storage/connections/${id}/test`
    )
    return response.data
  },

  getAuthUrl: async (provider: Exclude<CloudProvider, 'mega'>): Promise<AuthUrlResponse> => {
    const response = await apiClient.post<AuthUrlResponse | { data: AuthUrlResponse }>(
      `/cloud-storage/${provider}/auth-url`
    )
    const body = response.data
    if ('data' in body && body.data && 'url' in body.data) {
      return body.data as AuthUrlResponse
    }
    return body as AuthUrlResponse
  },
  handleCallback: async (provider: Exclude<CloudProvider, 'mega'>, data: OAuthCallbackData) => {
    const response = await apiClient.post<CloudConnection>(
      `/cloud-storage/${provider}/callback`,
      data
    )
    return response.data
  },
  refreshToken: async (provider: Exclude<CloudProvider, 'mega'>) => {
    const response = await apiClient.post<CloudConnection>(`/cloud-storage/${provider}/refresh`)
    return response.data
  },
  connectMega: async (credentials: MegaCredentials) => {
    const response = await apiClient.post<CloudConnection>(
      '/cloud-storage/mega/connect',
      credentials
    )
    return response.data
  },

  testMega: async () => {
    const response = await apiClient.post<TestConnectionResult>('/cloud-storage/mega/test')
    return response.data
  },

  getBackupJobs: async (): Promise<BackupJob[]> => {
    const response = await apiClient.get<BackupJob[] | { data: BackupJob[] }>(
      '/cloud-storage/backup-jobs'
    )
    const body = response.data
    return Array.isArray(body) ? body : ((body as { data: BackupJob[] }).data ?? [])
  },

  getBackupJob: async (id: string): Promise<BackupJob> => {
    const response = await apiClient.get<BackupJob | { data: BackupJob }>(
      `/cloud-storage/backup-jobs/${id}`
    )
    const body = response.data
    if ('data' in body && body.data && typeof body.data === 'object') {
      return body.data as BackupJob
    }
    return body as BackupJob
  },

  createBackup: async (data: CreateBackupData): Promise<BackupJob> => {
    const response = await apiClient.post<BackupJob | { data: BackupJob } | { id: string }>(
      '/cloud-storage/backup',
      data
    )
    const body = response.data
    if ('data' in body && body.data && typeof body.data === 'object') {
      return body.data as BackupJob
    }
    return body as BackupJob
  },
  cancelBackupJob: async (id: string) => {
    await apiClient.delete(`/cloud-storage/backup-jobs/${id}`)
  },

  /** @deprecated Use cancelBackupJob instead */
  deleteBackupJob: async (id: string) => {
    await apiClient.delete(`/cloud-storage/backup-jobs/${id}`)
  },
}

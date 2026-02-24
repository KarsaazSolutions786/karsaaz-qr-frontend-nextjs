/**
 * Cloud Storage Types
 * Types for cloud backup and storage integrations
 */

export type CloudProviderType = 'google_drive' | 'dropbox' | 'onedrive' | 'mega'

export type CloudConnectionType = 'oauth' | 'credentials'

export interface CloudProvider {
  id: CloudProviderType
  name: string
  icon?: string
  type: CloudConnectionType
  description?: string
}

export interface CloudConnection {
  id: string
  provider: CloudProviderType
  providerName: string
  email?: string
  connected_at: string
  last_used_at?: string
  status: 'active' | 'expired' | 'error'
  error_message?: string
  storage_used?: number
  storage_total?: number
}

export interface BackupJob {
  id: string
  connection_id: string
  provider: CloudProviderType
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  total_files: number
  processed_files: number
  total_size: number
  processed_size: number
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
}

export interface BackupHistoryItem {
  id: string
  connection_id: string
  provider: CloudProviderType
  filename: string
  size: number
  status: 'completed' | 'failed'
  created_at: string
  download_url?: string
}

export interface CreateBackupRequest {
  connection_id: string
  include_qrcodes: boolean
  include_analytics: boolean
  include_media: boolean
  include_settings: boolean
}

export interface MegaCredentials {
  email: string
  password: string
}

// Provider definitions
export const CLOUD_PROVIDERS: CloudProvider[] = [
  {
    id: 'google_drive',
    name: 'Google Drive',
    icon: '/assets/cloud-storage/google-drive.svg',
    type: 'oauth',
    description: 'Connect using your Google account',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '/assets/cloud-storage/dropbox.svg',
    type: 'oauth',
    description: 'Connect using your Dropbox account',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '/assets/cloud-storage/onedrive.svg',
    type: 'oauth',
    description: 'Connect using your Microsoft account',
  },
  {
    id: 'mega',
    name: 'MEGA',
    icon: '/assets/cloud-storage/mega.svg',
    type: 'credentials',
    description: 'Connect using email and password',
  },
]

export function getProvider(id: CloudProviderType): CloudProvider | undefined {
  return CLOUD_PROVIDERS.find(p => p.id === id)
}

export function formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

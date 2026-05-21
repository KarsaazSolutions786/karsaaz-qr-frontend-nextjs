/**
 * Cloud Storage API Client
 * API endpoints for cloud backup and storage integrations
 */

import {
  CloudConnection,
  BackupJob,
  BackupHistoryItem,
  CreateBackupRequest,
  MegaCredentials,
  CloudProviderType,
} from '@/types/entities/cloud-storage'

const BASE_URL = '/api/cloud-storage'

// ==================== CONNECTIONS ====================

/**
 * Purpose: Executes fetchConnections functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchConnections(): Promise<CloudConnection[]> {
  const response = await fetch(`${BASE_URL}/connections`)
  if (!response.ok) {
    throw new Error('Failed to fetch connections')
  }
  return response.json()
}

/**
 * Purpose: Deletes the specified resource.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function deleteConnection(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/connections/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete connection')
  }
}

/**
 * Purpose: Executes testConnection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function testConnection(id: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${BASE_URL}/connections/${id}/test`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to test connection')
  }
  return response.json()
}

// ==================== OAUTH PROVIDERS ====================

/**
 * Purpose: Retrieves authurl.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function getAuthUrl(provider: CloudProviderType): Promise<{ url: string }> {
  const response = await fetch(`${BASE_URL}/${provider}/auth-url`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to get auth URL')
  }
  return response.json()
}

/**
 * Purpose: Executes handleOAuthCallback functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function handleOAuthCallback(
  provider: CloudProviderType,
  code: string
): Promise<CloudConnection> {
  const response = await fetch(`${BASE_URL}/${provider}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!response.ok) {
    throw new Error('Failed to complete OAuth')
  }
  return response.json()
}

/**
 * Purpose: Executes refreshProviderToken functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function refreshProviderToken(provider: CloudProviderType): Promise<void> {
  const response = await fetch(`${BASE_URL}/${provider}/refresh`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }
}

// ==================== MEGA ====================

/**
 * Purpose: Executes connectMega functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function connectMega(credentials: MegaCredentials): Promise<CloudConnection> {
  const response = await fetch(`${BASE_URL}/mega/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to connect to MEGA')
  }
  return response.json()
}

/**
 * Purpose: Executes testMegaConnection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function testMegaConnection(): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${BASE_URL}/mega/test`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to test MEGA connection')
  }
  return response.json()
}

// ==================== BACKUP JOBS ====================

/**
 * Purpose: Executes createBackupJob functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function createBackupJob(data: CreateBackupRequest): Promise<BackupJob> {
  const response = await fetch(`${BASE_URL}/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create backup job')
  }
  return response.json()
}

/**
 * Purpose: Executes fetchBackupJobs functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchBackupJobs(): Promise<BackupJob[]> {
  const response = await fetch(`${BASE_URL}/backup-jobs`)
  if (!response.ok) {
    throw new Error('Failed to fetch backup jobs')
  }
  return response.json()
}

/**
 * Purpose: Executes fetchBackupJob functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchBackupJob(id: string): Promise<BackupJob> {
  const response = await fetch(`${BASE_URL}/backup-jobs/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch backup job')
  }
  return response.json()
}

/**
 * Purpose: Executes cancelBackupJob functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function cancelBackupJob(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/backup-jobs/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to cancel backup job')
  }
}

// ==================== BACKUP HISTORY ====================

/**
 * Purpose: Executes fetchBackupHistory functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function fetchBackupHistory(connectionId?: string): Promise<BackupHistoryItem[]> {
  const url = connectionId
    ? `${BASE_URL}/backup-history?connection_id=${connectionId}`
    : `${BASE_URL}/backup-history`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch backup history')
  }
  return response.json()
}

/**
 * Purpose: Executes downloadBackup functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export async function downloadBackup(id: string): Promise<{ url: string }> {
  const response = await fetch(`${BASE_URL}/backup-history/${id}/download`)
  if (!response.ok) {
    throw new Error('Failed to get download URL')
  }
  return response.json()
}

// ==================== REACT QUERY HOOKS ====================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Purpose: Executes useCloudConnections functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCloudConnections() {
  return useQuery({
    queryKey: ['cloud-connections'],
    queryFn: fetchConnections,
  })
}

/**
 * Purpose: Executes useDeleteConnection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteConnection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-connections'] })
    },
  })
}

/**
 * Purpose: Executes useTestConnection functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useTestConnection() {
  return useMutation({
    mutationFn: testConnection,
  })
}

/**
 * Purpose: Executes useConnectMega functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useConnectMega() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: connectMega,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-connections'] })
    },
  })
}

/**
 * Purpose: Executes useBackupJobs functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBackupJobs() {
  return useQuery({
    queryKey: ['backup-jobs'],
    queryFn: fetchBackupJobs,
    refetchInterval: query => {
      // Refetch every 5 seconds if there are running jobs
      const hasRunningJobs = query.state.data?.some(
        (job: BackupJob) => job.status === 'running' || job.status === 'pending'
      )
      return hasRunningJobs ? 5000 : false
    },
  })
}

/**
 * Purpose: Executes useCreateBackup functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBackupJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-jobs'] })
    },
  })
}

/**
 * Purpose: Executes useCancelBackup functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCancelBackup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelBackupJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backup-jobs'] })
    },
  })
}

/**
 * Purpose: Executes useBackupHistory functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBackupHistory(connectionId?: string) {
  return useQuery({
    queryKey: ['backup-history', connectionId],
    queryFn: () => fetchBackupHistory(connectionId),
  })
}

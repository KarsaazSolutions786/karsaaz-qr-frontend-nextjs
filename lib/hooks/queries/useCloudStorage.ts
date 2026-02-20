'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cloudStorageAPI, type CreateBackupData, type OAuthCallbackData, type MegaCredentials, type CloudProvider } from '@/lib/api/endpoints/cloud-storage'
import { queryKeys } from '@/lib/query/keys'

/**
 * Hook to list all cloud storage connections
 */
export function useCloudConnections() {
  return useQuery({
    queryKey: queryKeys.cloudStorage.connections(),
    queryFn: () => cloudStorageAPI.getConnections(),
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook to get a single connection
 */
export function useCloudConnection(id: string | null) {
  return useQuery({
    queryKey: queryKeys.cloudStorage.connection(id || ''),
    queryFn: () => cloudStorageAPI.getConnection(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

/**
 * Hook to list backup jobs
 */
export function useBackupJobs() {
  return useQuery({
    queryKey: queryKeys.cloudStorage.backupJobs(),
    queryFn: () => cloudStorageAPI.getBackupJobs(),
    staleTime: 30 * 1000, // 30 seconds (backups can change rapidly)
  })
}

/**
 * Hook to get a single backup job (for polling progress)
 */
export function useBackupJob(id: string | null) {
  return useQuery({
    queryKey: queryKeys.cloudStorage.backupJob(id || ''),
    queryFn: () => cloudStorageAPI.getBackupJob(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 3s while backup is in progress
      const data = query.state.data
      if (data && (data.status === 'pending' || data.status === 'in_progress')) {
        return 3000
      }
      return false
    },
  })
}

/**
 * Mutations for cloud storage operations
 */
export function useCloudStorageMutations() {
  const queryClient = useQueryClient()

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.connections() })
    queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.backupJobs() })
  }

  /** Delete a connection */
  const deleteConnection = useMutation({
    mutationFn: (id: string) => cloudStorageAPI.deleteConnection(id),
    onSuccess: () => invalidateAll(),
  })

  /** Test a connection */
  const testConnection = useMutation({
    mutationFn: (id: string) => cloudStorageAPI.testConnection(id),
  })

  /** Initiate OAuth connection (opens popup) */
  const connectOAuth = useMutation({
    mutationFn: async (provider: Exclude<CloudProvider, 'mega'>) => {
      const { url } = await cloudStorageAPI.getAuthUrl(provider)
      // Open OAuth popup
      const width = 600, height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      const popup = window.open(
        url,
        `${provider}_oauth`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      )
      return { popup, provider }
    },
  })

  /** Handle OAuth callback */
  const handleOAuthCallback = useMutation({
    mutationFn: ({ provider, data }: { provider: Exclude<CloudProvider, 'mega'>; data: OAuthCallbackData }) =>
      cloudStorageAPI.handleCallback(provider, data),
    onSuccess: () => invalidateAll(),
  })

  /** Connect MEGA */
  const connectMega = useMutation({
    mutationFn: (credentials: MegaCredentials) => cloudStorageAPI.connectMega(credentials),
    onSuccess: () => invalidateAll(),
  })

  /** Start a backup */
  const createBackup = useMutation({
    mutationFn: (data: CreateBackupData) => cloudStorageAPI.createBackup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.backupJobs() })
    },
  })

  /** Delete a backup job */
  const deleteBackupJob = useMutation({
    mutationFn: (id: string) => cloudStorageAPI.deleteBackupJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.backupJobs() })
    },
  })

  /** Refresh expired token */
  const refreshToken = useMutation({
    mutationFn: (provider: Exclude<CloudProvider, 'mega'>) => cloudStorageAPI.refreshToken(provider),
    onSuccess: () => invalidateAll(),
  })

  return {
    deleteConnection,
    testConnection,
    connectOAuth,
    handleOAuthCallback,
    connectMega,
    createBackup,
    deleteBackupJob,
    refreshToken,
  }
}

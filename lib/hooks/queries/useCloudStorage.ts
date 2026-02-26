'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useCallback, useEffect } from 'react'
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
 * Polls every 2s while job is pending/processing per CLOUD_STORAGE_DOCUMENTATION.md
 */
export function useBackupJob(id: string | null) {
  return useQuery({
    queryKey: queryKeys.cloudStorage.backupJob(id || ''),
    queryFn: () => cloudStorageAPI.getBackupJob(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 2s while backup is in progress (per docs)
      const data = query.state.data
      if (data && (data.status === 'pending' || data.status === 'processing' || data.status === 'in_progress')) {
        return 2000
      }
      return false
    },
  })
}

/**
 * OAuth Popup Status
 */
export type OAuthPopupStatus = 'idle' | 'waiting' | 'success' | 'error'

/**
 * Hook to manage OAuth popup flow with message listening
 * Per CLOUD_STORAGE_DOCUMENTATION.md Section 7
 */
export function useOAuthPopup(onComplete?: () => void) {
  const queryClient = useQueryClient()
  const popupRef = useRef<Window | null>(null)
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const handleOAuthCallback = useMutation({
    mutationFn: ({ provider, data }: { provider: Exclude<CloudProvider, 'mega'>; data: OAuthCallbackData }) =>
      cloudStorageAPI.handleCallback(provider, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.connections() })
      onComplete?.()
    },
  })

  // Cleanup function
  const cleanup = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null
    }
    popupRef.current = null
  }, [])

  // Message handler for OAuth callback
  const handleMessage = useCallback((event: MessageEvent) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) return
    
    const data = event.data
    if (data?.type !== 'cloud-oauth-callback') return

    const { code, state, provider } = data
    if (!code || !provider) return

    // Process the OAuth callback
    handleOAuthCallback.mutate({
      provider: provider as Exclude<CloudProvider, 'mega'>,
      data: { code, state },
    })

    cleanup()
  }, [handleOAuthCallback, cleanup])

  // Setup message listener
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      cleanup()
    }
  }, [handleMessage, cleanup])

  // Open OAuth popup
  const openPopup = useCallback(async (provider: Exclude<CloudProvider, 'mega'>) => {
    try {
      const { url } = await cloudStorageAPI.getAuthUrl(provider)
      
      // Open OAuth popup (600x700 per docs)
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      
      const popup = window.open(
        url,
        'cloud-oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
      )

      if (!popup) {
        throw new Error('Popup was blocked. Please allow popups for this site.')
      }

      popupRef.current = popup

      // Start popup close detection (500ms interval per docs)
      checkIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          cleanup()
        }
      }, 500)

      return { popup, provider }
    } catch (error) {
      cleanup()
      throw error
    }
  }, [cleanup])

  return {
    openPopup,
    isProcessing: handleOAuthCallback.isPending,
    error: handleOAuthCallback.error,
    isSuccess: handleOAuthCallback.isSuccess,
  }
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

  /** Update a connection */
  const updateConnection = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { provider?: string; name?: string; access_key?: string; secret_key?: string; bucket?: string; region?: string } }) =>
      cloudStorageAPI.updateConnection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.connections() })
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.connection(variables.id) })
    },
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

  /** Cancel an in-progress backup job */
  const cancelBackupJob = useMutation({
    mutationFn: (id: string) => cloudStorageAPI.cancelBackupJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cloudStorage.backupJobs() })
    },
  })

  /** Delete a backup job (alias for cancelBackupJob for backward compatibility) */
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
    updateConnection,
    testConnection,
    connectOAuth,
    handleOAuthCallback,
    connectMega,
    createBackup,
    cancelBackupJob,
    deleteBackupJob,
    refreshToken,
  }
}

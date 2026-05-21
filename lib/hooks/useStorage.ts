'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storageAPI, StorageUsageStats, GuestStorageStats } from '@/lib/api/endpoints/storage'
import { useGuest } from '@/lib/hooks/useGuest'

const STORAGE_QUERY_KEY = ['storage', 'usage']
const GUEST_STORAGE_QUERY_KEY = ['guest-storage', 'usage']

/**
 * Purpose: Executes useStorage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useStorage() {
  const { isGuest } = useGuest()

  const userQuery = useQuery<StorageUsageStats>({
    queryKey: STORAGE_QUERY_KEY,
    queryFn: storageAPI.getUsage,
    staleTime: 60_000, // 1 min
    gcTime: 5 * 60_000,
    retry: 1,
    enabled: !isGuest && typeof window !== 'undefined' && !!(localStorage.getItem('logged_in') || localStorage.getItem('token')),
  })

  const guestQuery = useQuery<GuestStorageStats>({
    queryKey: GUEST_STORAGE_QUERY_KEY,
    queryFn: storageAPI.getGuestUsage,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    enabled: isGuest,
  })

  const queryClient = useQueryClient()

  const recalculateMutation = useMutation({
    mutationFn: storageAPI.recalculate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORAGE_QUERY_KEY })
    },
  })

  const stats = isGuest ? guestQuery.data : userQuery.data
  const isLoading = isGuest ? guestQuery.isLoading : userQuery.isLoading
  const error = isGuest ? guestQuery.error : userQuery.error

  // Determine warning levels
  const percentage = stats?.percentage ?? 0
  const isNearLimit = percentage >= 80 && percentage < 95
  const isAtLimit = percentage >= 95
  const isOverLimit = percentage >= 100

  return {
    stats,
    isLoading,
    error,
    isGuest,
    percentage,
    isNearLimit,
    isAtLimit,
    isOverLimit,
    recalculate: recalculateMutation.mutate,
    isRecalculating: recalculateMutation.isPending,
    usedFormatted: stats?.used_formatted ?? '0 B',
    quotaFormatted: stats?.quota_formatted ?? '0 B',
    remainingFormatted: (stats as StorageUsageStats)?.remaining_formatted ?? '0 B',
    isUnlimited: (stats as StorageUsageStats)?.is_unlimited ?? false,
  }
}

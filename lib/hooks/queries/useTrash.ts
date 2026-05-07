'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trashAPI, TrashListParams } from '@/lib/api/endpoints/trash'
import { queryKeys } from '@/lib/query/keys'

/** Fetch paginated trashed QR codes. */
export function useTrashList(params: TrashListParams = {}) {
  return useQuery({
    queryKey: queryKeys.trash.list(params as Record<string, unknown>),
    queryFn: () => trashAPI.list(params),
    staleTime: 30 * 1000,
  })
}

/** Fetch the user's trash settings. */
export function useTrashSettings() {
  return useQuery({
    queryKey: queryKeys.trash.settings(),
    queryFn: () => trashAPI.getSettings(),
    staleTime: 60 * 1000,
  })
}

/** Restore a single QR code from trash. */
export function useRestoreQRCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => trashAPI.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
    },
  })
}

/** Restore multiple QR codes from trash. */
export function useRestoreManyQRCodes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: (number | string)[]) => trashAPI.restoreMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
    },
  })
}

/** Permanently delete a single QR code from trash. */
export function useDestroyTrashedQRCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => trashAPI.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    },
  })
}

/** Permanently delete multiple QR codes from trash. */
export function useDestroyManyTrashedQRCodes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: (number | string)[]) => trashAPI.destroyMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    },
  })
}

/** Empty the entire trash. */
export function useEmptyTrash() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => trashAPI.empty(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] })
    },
  })
}

/** Update the user's trash settings (auto-delete and/or storage limit). */
export function useUpdateTrashSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      trash_auto_delete_days?: number | null
      trash_storage_limit_mb?: number
    }) => trashAPI.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.settings() })
    },
  })
}

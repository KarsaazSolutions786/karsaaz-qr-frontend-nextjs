'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkOperationsAPI } from '@/lib/api/endpoints/bulk-operations'

// Query keys for bulk operations
export const bulkOperationsKeys = {
  all: ['bulk-operations'] as const,
  importInstances: () => [...bulkOperationsKeys.all, 'import-url-instances'] as const,
  importInstance: (id: string) => [...bulkOperationsKeys.all, 'import-url-instances', id] as const,
}

/**
 * Hook to fetch all bulk import URL instances
 */
export function useBulkImportInstances() {
  return useQuery({
    queryKey: bulkOperationsKeys.importInstances(),
    queryFn: () => bulkOperationsAPI.getImportUrlInstances(),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to fetch a single bulk import URL instance
 */
export function useBulkImportInstance(id: string | undefined) {
  return useQuery({
    queryKey: bulkOperationsKeys.importInstance(id || ''),
    queryFn: () => bulkOperationsAPI.getImportUrlInstance(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

/**
 * Hook for bulk operation mutations
 */
export function useBulkOperationsMutations() {
  const queryClient = useQueryClient()

  const invalidateInstances = () => {
    queryClient.invalidateQueries({ queryKey: bulkOperationsKeys.importInstances() })
  }

  /** Create bulk import from CSV file */
  const createImport = useMutation({
    mutationFn: (file: File) => bulkOperationsAPI.createImportFromCsv(file),
    onSuccess: invalidateInstances,
  })

  /** Re-run a bulk operation */
  const reRunInstance = useMutation({
    mutationFn: (id: number) => bulkOperationsAPI.reRunInstance(id),
    onSuccess: invalidateInstances,
  })

  /** Delete a bulk operation instance */
  const deleteInstance = useMutation({
    mutationFn: (id: number) => bulkOperationsAPI.deleteInstance(id),
    onSuccess: invalidateInstances,
  })

  /** Delete all QR codes from a bulk operation */
  const deleteAllQRCodes = useMutation({
    mutationFn: (id: number) => bulkOperationsAPI.deleteAllQRCodes(id),
    onSuccess: invalidateInstances,
  })

  /** Rename a bulk operation instance */
  const renameInstance = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => bulkOperationsAPI.renameInstance(id, name),
    onSuccess: invalidateInstances,
  })

  return {
    createImport,
    reRunInstance,
    deleteInstance,
    deleteAllQRCodes,
    renameInstance,
  }
}

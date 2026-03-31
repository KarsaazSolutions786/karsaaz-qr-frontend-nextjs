'use client'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { qrcodesAPI, ListQRCodesParams } from '@/lib/api/endpoints/qrcodes'
import { guestAPI } from '@/lib/api/endpoints/guest'
import { queryKeys } from '@/lib/query/keys'
import { useGuest } from '@/lib/hooks/useGuest'

export function useQRCodes(params: ListQRCodesParams = {}) {
  const { isGuest } = useGuest()

  return useQuery({
    queryKey: isGuest ? ['guest-qrcodes', 'list'] : queryKeys.qrcodes.list(params as Record<string, unknown>),
    queryFn: async ({ signal }): Promise<{ data: any[]; pagination: { currentPage: number; lastPage: number; perPage: number; total: number } }> => {
      if (isGuest) {
        const qrcodes = await guestAPI.listQrcodes()
        return {
          data: qrcodes.map(gqr => ({
            id: String(gqr.id),
            name: gqr.name,
            type: gqr.type,
            data: gqr.data,
            design: gqr.design,
            customization: gqr.design,
            designerConfig: gqr.design,
            status: 'active' as const,
            scans: 0,
            filePath: gqr.file_path,
            isStatic: gqr.is_static,
            downloadCount: gqr.download_count,
            createdAt: gqr.created_at,
            updatedAt: gqr.updated_at,
            tags: [],
            _isGuestQr: true,
          })),
          pagination: { currentPage: 1, lastPage: 1, perPage: 50, total: qrcodes.length },
        }
      }
      return qrcodesAPI.list(params, signal) as any
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status
      if (status === 429 || (status >= 400 && status < 500)) return false
      return failureCount < 2
    },
  })
}

// QR Code Analytics hook
export function useQRCodeAnalytics(qrCodeId: number | string | undefined) {
  return useQuery({
    queryKey: ['qrcodes', qrCodeId, 'analytics'],
    queryFn: () => qrcodesAPI.getAnalytics(qrCodeId!),
    enabled: !!qrCodeId,
    staleTime: 60 * 1000, // 1 minute
  })
}

// QR Code Link Settings hook
export function useQRLinkSettings(qrCodeId: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['qrcodes', qrCodeId, 'link-settings'],
    queryFn: () => qrcodesAPI.getLinkSettings(qrCodeId!),
    enabled: (options?.enabled ?? true) && !!qrCodeId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Update QR Code Link Settings mutation
export function useUpdateQRLinkSettings(qrCodeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { slug: string; redirectEnabled: boolean }) =>
      qrcodesAPI.updateLinkSettings(qrCodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes', qrCodeId, 'link-settings'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.detail(qrCodeId) })
    },
  })
}

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { qrcodesAPI, ListQRCodesParams } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useQRCodes(params: ListQRCodesParams = {}) {
  return useQuery({
    queryKey: queryKeys.qrcodes.list(params as Record<string, unknown>),
    queryFn: () => qrcodesAPI.list(params),
    staleTime: 30 * 1000, // 30 seconds
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

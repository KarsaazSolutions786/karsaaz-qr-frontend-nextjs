'use client'

import { useQuery } from '@tanstack/react-query'
import { qrcodesAPI, ListQRCodesParams } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useQRCodes(params: ListQRCodesParams = {}) {
  return useQuery({
    queryKey: queryKeys.qrcodes.list(params as Record<string, unknown>),
    queryFn: () => qrcodesAPI.list(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useQRCode(id: string) {
  return useQuery({
    queryKey: queryKeys.qrcodes.detail(id),
    queryFn: () => qrcodesAPI.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

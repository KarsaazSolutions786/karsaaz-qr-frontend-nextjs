'use client'

import { useQuery } from '@tanstack/react-query'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { guestAPI } from '@/lib/api/endpoints/guest'
import { queryKeys } from '@/lib/query/keys'
import { useGuest } from '@/lib/hooks/useGuest'

export function useQRCode(id: string) {
  const { isGuest } = useGuest()

  return useQuery({
    queryKey: isGuest ? ['guest-qrcodes', id] : queryKeys.qrcodes.detail(id),
    queryFn: async () => {
      if (isGuest) {
        const gqr = await guestAPI.getQrcode(Number(id))
        return {
          id: String(gqr.id),
          userId: '',
          name: gqr.name,
          type: gqr.type,
          data: gqr.data,
          design: gqr.design,
          customization: gqr.design || {},
          designerConfig: gqr.design,
          status: 'active',
          scans: 0,
          filePath: gqr.file_path,
          isStatic: gqr.is_static,
          downloadCount: gqr.download_count,
          createdAt: gqr.created_at,
          updatedAt: gqr.updated_at,
          tags: [],
          _isGuestQr: true,
        } as any
      }
      return qrcodesAPI.get(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

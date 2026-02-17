'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { qrcodesAPI, BulkCreateRequest } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useBulkCreateQRCodes() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkCreateRequest) => qrcodesAPI.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
      router.push('/qrcodes')
    },
  })
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { qrcodesAPI, CreateQRCodeRequest } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useCreateQRCode() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQRCodeRequest) => qrcodesAPI.create(data),
    onSuccess: (qrcode) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
      router.push(`/qrcodes/${qrcode.id}`)
    },
  })
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qrcodesAPI, ChangeQRTypeRequest } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useChangeQRType(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChangeQRTypeRequest) => qrcodesAPI.changeType(id, data),
    onSuccess: (qrcode) => {
      queryClient.setQueryData(queryKeys.qrcodes.detail(id), qrcode)
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
    },
  })
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export function useDeleteQRCode() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => qrcodesAPI.delete(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.qrcodes.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
      router.push('/qrcodes')
    },
  })
}

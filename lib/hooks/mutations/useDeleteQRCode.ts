'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

/**
 * Purpose: Executes useDeleteQRCode functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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
    onError: (error: any) => {
      const status = error?.response?.status
      const message: string = error?.response?.data?.message ?? ''
      if (status === 422 && message.toLowerCase().includes('trash')) {
        toast.error('Trash storage is full', {
          description: 'Empty your trash to delete more QR codes.',
          action: {
            label: 'Empty Trash',
            onClick: () => router.push('/trash'),
          },
        })
      }
    },
  })
}

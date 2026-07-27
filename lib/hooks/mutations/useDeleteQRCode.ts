'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'

export function useDeleteQRCode() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => qrcodesAPI.delete(id),
    onSuccess: () => {
      toast.success('Successfully moved to trash')
      queryClient.invalidateQueries({ queryKey: ['qrcodes', 'list'] })
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

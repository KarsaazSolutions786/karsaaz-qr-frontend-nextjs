import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { customCodesAPI } from '@/lib/api/endpoints/custom-codes'
import { queryKeys } from '@/lib/query/keys'
import type { CreateCustomCodeRequest } from '@/types/entities/custom-code'

/**
 * Purpose: Executes useCreateCustomCode functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateCustomCode() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCustomCodeRequest) => customCodesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customCodes.all() })
      router.push('/custom-codes')
    },
  })
}

/**
 * Purpose: Executes useUpdateCustomCode functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateCustomCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCustomCodeRequest> }) =>
      customCodesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customCodes.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.customCodes.detail(variables.id) })
    },
  })
}

/**
 * Purpose: Executes useDeleteCustomCode functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteCustomCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => customCodesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customCodes.all() })
    },
  })
}

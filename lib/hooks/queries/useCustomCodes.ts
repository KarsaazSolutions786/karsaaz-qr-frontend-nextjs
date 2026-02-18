import { useQuery } from '@tanstack/react-query'
import { customCodesAPI } from '@/lib/api/endpoints/custom-codes'
import { queryKeys } from '@/lib/query/keys'

// Get all custom codes
export function useCustomCodes(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.customCodes.list(params),
    queryFn: () => customCodesAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single custom code
export function useCustomCode(id: number) {
  return useQuery({
    queryKey: queryKeys.customCodes.detail(id),
    queryFn: () => customCodesAPI.getById(id),
    enabled: !!id,
  })
}

// Get custom code positions
export function useCustomCodePositions() {
  return useQuery({
    queryKey: queryKeys.customCodes.positions(),
    queryFn: () => customCodesAPI.getPositions(),
    staleTime: 60000,
  })
}

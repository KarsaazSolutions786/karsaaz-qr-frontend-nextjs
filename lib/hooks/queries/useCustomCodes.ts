import { useQuery } from '@tanstack/react-query'
import { customCodesAPI } from '@/lib/api/endpoints/custom-codes'
import { queryKeys } from '@/lib/query/keys'

// Get all custom codes
/**
 * Purpose: Executes useCustomCodes functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCustomCodes(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.customCodes.list(params),
    queryFn: () => customCodesAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single custom code
/**
 * Purpose: Executes useCustomCode functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCustomCode(id: number) {
  return useQuery({
    queryKey: queryKeys.customCodes.detail(id),
    queryFn: () => customCodesAPI.getById(id),
    enabled: !!id,
  })
}

// Get custom code positions
/**
 * Purpose: Executes useCustomCodePositions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCustomCodePositions() {
  return useQuery({
    queryKey: queryKeys.customCodes.positions(),
    queryFn: () => customCodesAPI.getPositions(),
    staleTime: 60000,
  })
}

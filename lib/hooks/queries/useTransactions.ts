import { useQuery } from '@tanstack/react-query'
import { transactionsAPI } from '@/lib/api/endpoints/transactions'
import { queryKeys } from '@/lib/query/keys'

// Get all transactions
/**
 * Purpose: Executes useTransactions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useTransactions(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => transactionsAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single transaction
/**
 * Purpose: Executes useTransaction functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useTransaction(id: number) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsAPI.getById(id),
    enabled: !!id,
  })
}

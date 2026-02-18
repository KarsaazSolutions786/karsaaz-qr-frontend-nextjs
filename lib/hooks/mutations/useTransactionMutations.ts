import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsAPI } from '@/lib/api/endpoints/transactions'
import { queryKeys } from '@/lib/query/keys'

export function useApproveTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionsAPI.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() })
    },
  })
}

export function useRejectTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionsAPI.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all() })
    },
  })
}

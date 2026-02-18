import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { currenciesAPI } from '@/lib/api/endpoints/currencies'
import { queryKeys } from '@/lib/query/keys'
import type { CreateCurrencyRequest } from '@/types/entities/currency'

export function useCreateCurrency() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCurrencyRequest) => currenciesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies.all() })
      router.push('/currencies')
    },
  })
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCurrencyRequest> }) =>
      currenciesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies.detail(variables.id) })
    },
  })
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => currenciesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies.all() })
    },
  })
}

export function useToggleCurrencyEnabled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => currenciesAPI.enable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies.all() })
    },
  })
}

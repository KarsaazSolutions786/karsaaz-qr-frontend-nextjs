import { useQuery } from '@tanstack/react-query'
import { currenciesAPI } from '@/lib/api/endpoints/currencies'
import { queryKeys } from '@/lib/query/keys'


export function useCurrencies(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.currencies.list(params),
    queryFn: () => currenciesAPI.getAll(params),
    staleTime: 30000,
  })
}


export function useCurrency(id: number) {
  return useQuery({
    queryKey: queryKeys.currencies.detail(id),
    queryFn: () => currenciesAPI.getById(id),
    enabled: !!id,
  })
}

import { useQuery } from '@tanstack/react-query'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import { queryKeys } from '@/lib/query/keys'

// Get all translations
export function useTranslations(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.translations.list(params),
    queryFn: () => translationsAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single translation
export function useTranslation(id: number) {
  return useQuery({
    queryKey: queryKeys.translations.detail(id),
    queryFn: () => translationsAPI.getById(id),
    enabled: !!id,
  })
}

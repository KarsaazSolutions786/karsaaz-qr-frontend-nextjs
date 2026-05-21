import { useQuery } from '@tanstack/react-query'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import { queryKeys } from '@/lib/query/keys'

// Get all translations
/**
 * Purpose: Executes useTranslations functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useTranslations(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.translations.list(params),
    queryFn: () => translationsAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single translation
/**
 * Purpose: Executes useTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useTranslation(id: number) {
  return useQuery({
    queryKey: queryKeys.translations.detail(id),
    queryFn: () => translationsAPI.getById(id),
    enabled: !!id,
  })
}

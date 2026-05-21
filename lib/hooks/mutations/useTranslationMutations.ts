import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import { queryKeys } from '@/lib/query/keys'
import type { CreateTranslationRequest } from '@/types/entities/translation'

/**
 * Purpose: Executes useCreateTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateTranslation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTranslationRequest) => translationsAPI.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
      // Redirect to edit page so user can upload translation JSON file (only available after first save)
      router.push(`/translations/${result.id}`)
    },
  })
}

/**
 * Purpose: Executes useUpdateTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTranslationRequest> }) =>
      translationsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.detail(variables.id) })
    },
  })
}

/**
 * Purpose: Executes useDeleteTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => translationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
    },
  })
}

/**
 * Purpose: Executes useSetMainTranslation functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useSetMainTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => translationsAPI.setMain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
    },
  })
}

/**
 * Purpose: Executes useToggleTranslationActive functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useToggleTranslationActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => translationsAPI.toggleActivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
    },
  })
}

/**
 * Purpose: Executes useAutoTranslate functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useAutoTranslate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => translationsAPI.autoTranslate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.translations.all() })
    },
  })
}

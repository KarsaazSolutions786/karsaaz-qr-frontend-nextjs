import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { leadFormsAPI } from '@/lib/api/endpoints/lead-forms'
import { queryKeys } from '@/lib/query/keys'
import type { CreateLeadFormRequest } from '@/types/entities/lead-form'

// Create lead form
export function useCreateLeadForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLeadFormRequest) => leadFormsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadForms.all() })
      router.push('/lead-forms')
    },
  })
}

// Update lead form
export function useUpdateLeadForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateLeadFormRequest> }) =>
      leadFormsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadForms.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.leadForms.detail(variables.id) })
    },
  })
}

// Delete lead form
export function useDeleteLeadForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => leadFormsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadForms.all() })
    },
  })
}

// Delete response
export function useDeleteLeadFormResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (responseId: number) => leadFormsAPI.deleteResponse(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadForms.responses() })
    },
  })
}

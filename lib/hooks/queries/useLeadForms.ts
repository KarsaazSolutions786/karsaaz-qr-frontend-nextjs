import { useQuery } from '@tanstack/react-query'
import { leadFormsAPI } from '@/lib/api/endpoints/lead-forms'
import { queryKeys } from '@/lib/query/keys'


export function useLeadForms(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.leadForms.list(params),
    queryFn: () => leadFormsAPI.getAll(params),
    staleTime: 30000, // 30 seconds
  })
}

export function useLeadForm(id: number) {
  return useQuery({
    queryKey: queryKeys.leadForms.detail(id),
    queryFn: () => leadFormsAPI.getById(id),
    enabled: !!id,
  })
}

export function useLeadFormResponses(formId: number, params?: { page?: number }) {
  return useQuery({
    queryKey: queryKeys.leadForms.responses(formId, params),
    queryFn: () => leadFormsAPI.getResponses(formId, params),
    enabled: !!formId,
  })
}

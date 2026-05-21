import { useQuery } from '@tanstack/react-query'
import { leadFormsAPI } from '@/lib/api/endpoints/lead-forms'
import { queryKeys } from '@/lib/query/keys'

// Get all lead forms
/**
 * Purpose: Executes useLeadForms functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useLeadForms(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.leadForms.list(params),
    queryFn: () => leadFormsAPI.getAll(params),
    staleTime: 30000, // 30 seconds
  })
}

// Get single lead form
/**
 * Purpose: Executes useLeadForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useLeadForm(id: number) {
  return useQuery({
    queryKey: queryKeys.leadForms.detail(id),
    queryFn: () => leadFormsAPI.getById(id),
    enabled: !!id,
  })
}

// Get form responses
/**
 * Purpose: Executes useLeadFormResponses functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useLeadFormResponses(formId: number, params?: { page?: number }) {
  return useQuery({
    queryKey: queryKeys.leadForms.responses(formId, params),
    queryFn: () => leadFormsAPI.getResponses(formId, params),
    enabled: !!formId,
  })
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import {
  getTemplates,
  getTemplate,
  getTemplateCategories,
  getTemplateCategory,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
  useTemplate as useTemplateApi,
} from '@/lib/api/endpoints/templates'
import type {
  QRCodeTemplate,
  TemplateCategory,
  TemplateFilters,
  CreateTemplateInput,
  UpdateTemplateInput,
  UseTemplateInput,
} from '@/types/entities/template'


export const templatesKeys = {
  all: ['templates'] as const,
  lists: () => [...templatesKeys.all, 'list'] as const,
  list: (filters?: TemplateFilters) => [...templatesKeys.lists(), filters] as const,
  details: () => [...templatesKeys.all, 'detail'] as const,
  detail: (id: number) => [...templatesKeys.details(), id] as const,
  categories: ['template-categories'] as const,
}


export function useTemplates(
  filters?: TemplateFilters,
  options?: Omit<UseQueryOptions<QRCodeTemplate[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templatesKeys.list(filters),
    queryFn: () => getTemplates(filters),
    ...options,
  })
}


export function useTemplate(
  id: number,
  options?: Omit<UseQueryOptions<QRCodeTemplate>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templatesKeys.detail(id),
    queryFn: () => getTemplate(id),
    enabled: !!id,
    ...options,
  })
}


export function useTemplateCategories(
  options?: Omit<UseQueryOptions<TemplateCategory[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templatesKeys.categories,
    queryFn: getTemplateCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}


export function useCreateTemplate(
  options?: UseMutationOptions<QRCodeTemplate, Error, CreateTemplateInput>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.lists() })
    },
    ...options,
  })
}


export function useUpdateTemplate(
  options?: UseMutationOptions<QRCodeTemplate, Error, UpdateTemplateInput>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templatesKeys.detail(data.id) })
    },
    ...options,
  })
}


export function useDeleteTemplate(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.lists() })
    },
    ...options,
  })
}


export function useUseTemplate(
  options?: UseMutationOptions<Partial<any>, Error, UseTemplateInput>
) {
  return useMutation({
    mutationFn: useTemplateApi,
    ...options,
  })
}


export function useTemplateCategory(
  id: number | string | null,
  options?: Omit<UseQueryOptions<TemplateCategory>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...templatesKeys.categories, id],
    queryFn: () => getTemplateCategory(id!),
    enabled: !!id && id !== 'new',
    ...options,
  })
}


export function useCreateTemplateCategory(
  options?: UseMutationOptions<TemplateCategory, Error, { name: string; text_color?: string; sort_order?: number }>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTemplateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.categories })
    },
    ...options,
  })
}


export function useUpdateTemplateCategory(
  options?: UseMutationOptions<TemplateCategory, Error, { id: number | string; data: { name?: string; text_color?: string; sort_order?: number } }>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateTemplateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.categories })
      queryClient.invalidateQueries({ queryKey: [...templatesKeys.categories, variables.id] })
    },
    ...options,
  })
}


export function useDeleteTemplateCategory(
  options?: UseMutationOptions<void, Error, number | string>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTemplateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatesKeys.categories })
    },
    ...options,
  })
}

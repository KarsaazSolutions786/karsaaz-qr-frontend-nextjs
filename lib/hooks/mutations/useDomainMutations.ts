import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { domainsAPI } from '@/lib/api/endpoints/domains'
import { queryKeys } from '@/lib/query/keys'
import type { CreateDomainRequest, UpdateDomainRequest } from '@/lib/api/endpoints/domains'
import type { DomainStatus } from '@/types/entities/domain'

export function useCreateDomain() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDomainRequest) => domainsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all() })
      router.push('/domains')
    },
  })
}

export function useUpdateDomain() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDomainRequest }) =>
      domainsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.detail(variables.id) })
    },
  })
}

export function useDeleteDomain() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => domainsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all() })
    },
  })
}

export function useTestDomainConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => domainsAPI.testConnection(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.detail(id) })
    },
  })
}

export function useChangeDomainStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DomainStatus }) =>
      domainsAPI.changeStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.domains.detail(variables.id) })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { rolesAPI, type RoleEntity } from '@/lib/api/endpoints/roles'
import { queryKeys } from '@/lib/query/keys'

export function useCreateRole() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; home_page?: string; permission_ids: number[] }) =>
      rolesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() })
      router.push('/users/roles')
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RoleEntity> }) =>
      rolesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.id) })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => rolesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all() })
    },
  })
}

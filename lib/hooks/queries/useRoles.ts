import { useQuery } from '@tanstack/react-query'
import { rolesAPI } from '@/lib/api/endpoints/roles'
import { queryKeys } from '@/lib/query/keys'

// Get all roles
export function useRoles(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => rolesAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single role
export function useRole(id: number) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesAPI.getById(id),
    enabled: !!id,
  })
}

// Get all permissions
export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.roles.permissions(),
    queryFn: () => rolesAPI.getPermissions(),
    staleTime: 60000,
  })
}

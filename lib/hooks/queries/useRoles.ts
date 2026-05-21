import { useQuery } from '@tanstack/react-query'
import { rolesAPI } from '@/lib/api/endpoints/roles'
import { queryKeys } from '@/lib/query/keys'

// Get all roles
/**
 * Purpose: Executes useRoles functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useRoles(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => rolesAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single role
/**
 * Purpose: Executes useRole functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useRole(id: number) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesAPI.getById(id),
    enabled: !!id,
  })
}

// Get all permissions
/**
 * Purpose: Executes usePermissions functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.roles.permissions(),
    queryFn: () => rolesAPI.getPermissions(),
    staleTime: 60000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'

// Get all users
export function useUsers(params?: { page?: number; per_page?: number; search?: string; paying?: 'paying' | 'non-paying'; number_of_qrcodes?: string; role_id?: string; status?: string; plan_id?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single user
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersAPI.getById(Number(id)),
    enabled: !!id,
  })
}

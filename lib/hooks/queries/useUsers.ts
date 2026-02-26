import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

// Get sub-users for a parent user
export function useSubUsers(parentId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.users.subUsers(parentId!),
    queryFn: () => usersAPI.getSubUsers(parentId!),
    enabled: !!parentId,
    staleTime: 30000,
  })
}

// Invite sub-user mutation
export function useInviteSubUser(parentId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; mobile?: string; folder_id: string }) =>
      usersAPI.inviteSubUser(parentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.subUsers(parentId) })
    },
  })
}

// Delete sub-user mutation
export function useDeleteSubUser(parentId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subUserId: number) => usersAPI.deleteSubUser(parentId, subUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.subUsers(parentId) })
    },
  })
}

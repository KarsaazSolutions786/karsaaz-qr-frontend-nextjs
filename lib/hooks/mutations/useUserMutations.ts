import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'
import type { User } from '@/types/entities/user'

export function useCreateUser() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<User>) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      router.push('/users')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      usersAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(String(variables.id)) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

export function useActAsUser() {
  return useMutation({
    mutationFn: (id: number) => usersAPI.actAs(id),
  })
}

export function useVerifyUserEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.verifyEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

export function useResetUserScansLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.resetScansLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

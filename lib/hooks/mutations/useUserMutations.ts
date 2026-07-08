import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { usersAPI } from '@/lib/api/endpoints/users'
import { queryKeys } from '@/lib/query/keys'
import type { User } from '@/types/entities/user'

export function useCreateUser() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<User> & { role_id?: number; password?: string; password_confirmation?: string }) =>
      usersAPI.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      router.push(`/users/${data.id}`)
    },
  })
}

/**
 * Purpose: Executes useUpdateUser functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> & { role_id?: number; password?: string; password_confirmation?: string } }) =>
      usersAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(String(variables.id)) })
    },
  })
}

/**
 * Purpose: Executes useDeleteUser functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

/**
 * Purpose: Executes useActAsUser functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useActAsUser() {
  const router = useRouter()
  return useMutation({
    mutationFn: (id: number) => usersAPI.actAs(id),
    onSuccess: (data: any) => {
      // Store current admin as mainUser, swap to impersonated user.
      // The impersonation token is stored in localStorage so the Bearer header
      // overrides the admin's httpOnly cookie on subsequent requests.
      if (typeof window !== 'undefined' && data?.user && data?.token) {
        const mainUser = {
          user: JSON.parse(localStorage.getItem('user') || 'null'),
          token: null, // Admin uses cookie auth; no token to save
        }
        localStorage.setItem('mainUser', JSON.stringify(mainUser))
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
      }
      // Navigate home and reload to pick up new session
      router.push('/qrcodes')
      setTimeout(() => window.location.reload(), 100)
    },
  })
}

/**
 * Purpose: Executes useVerifyUserEmail functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useVerifyUserEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.verifyEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

/**
 * Purpose: Executes useResetUserScansLimit functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useResetUserScansLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.resetScansLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

/**
 * Purpose: Executes useResetUserRole functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useResetUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersAPI.resetRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

/**
 * Purpose: Executes useGenerateMagicUrl functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useGenerateMagicUrl() {
  return useMutation({
    mutationFn: (id: number) => usersAPI.generateMagicUrl(id),
  })
}

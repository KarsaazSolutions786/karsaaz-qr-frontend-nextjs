import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { contactsAPI } from '@/lib/api/endpoints/contacts'
import { queryKeys } from '@/lib/query/keys'
import type { CreateContactRequest } from '@/types/entities/contact'

/**
 * Purpose: Executes useCreateContact functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateContact() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all() })
      router.push('/contacts')
    },
  })
}

/**
 * Purpose: Executes useUpdateContact functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateContactRequest> }) =>
      contactsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(variables.id) })
    },
  })
}

/**
 * Purpose: Executes useDeleteContact functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => contactsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all() })
    },
  })
}

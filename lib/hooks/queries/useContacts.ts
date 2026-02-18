import { useQuery } from '@tanstack/react-query'
import { contactsAPI } from '@/lib/api/endpoints/contacts'
import { queryKeys } from '@/lib/query/keys'

// Get all contacts
export function useContacts(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params),
    queryFn: () => contactsAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single contact
export function useContact(id: number) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: () => contactsAPI.getById(id),
    enabled: !!id,
  })
}

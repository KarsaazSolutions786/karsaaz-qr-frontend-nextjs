import apiClient from '../client'
import type {
  Contact,
  ContactListResponse,
  CreateContactRequest,
} from '@/types/entities/contact'

export const contactsAPI = {
  // Get all contacts
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<ContactListResponse>('/contacts', { params })
    return response.data
  },

  // Get single contact
  getById: async (id: number) => {
    const response = await apiClient.get<Contact>(`/contacts/${id}`)
    return response.data
  },

  // Create new contact
  create: async (data: CreateContactRequest) => {
    const response = await apiClient.post<Contact>('/contacts', data)
    return response.data
  },

  // Update contact
  update: async (id: number, data: Partial<CreateContactRequest>) => {
    const response = await apiClient.put<Contact>(`/contacts/${id}`, data)
    return response.data
  },

  // Delete contact
  delete: async (id: number) => {
    await apiClient.delete(`/contacts/${id}`)
  },
}

import apiClient from '../client'
import type {
  LeadForm,
  LeadFormsResponse,
  LeadFormResponsesResponse,
  CreateLeadFormRequest,
  LeadFormSubmission,
} from '@/types/entities/lead-form'

export const leadFormsAPI = {
  // Get all lead forms
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<LeadFormsResponse>('/lead-forms', { params })
    return response.data
  },

  // Get single lead form
  getById: async (id: number) => {
    const response = await apiClient.get<LeadForm>(`/lead-forms/${id}`)
    return response.data
  },

  // Create new lead form
  create: async (data: CreateLeadFormRequest) => {
    const response = await apiClient.post<LeadForm>('/lead-forms', data)
    return response.data
  },

  // Update lead form
  update: async (id: number, data: Partial<CreateLeadFormRequest>) => {
    const response = await apiClient.put<LeadForm>(`/lead-forms/${id}`, data)
    return response.data
  },

  // Delete lead form
  delete: async (id: number) => {
    const response = await apiClient.delete(`/lead-forms/${id}`)
    return response.data
  },

  // Get form responses
  getResponses: async (formId: number, params?: { page?: number }) => {
    const response = await apiClient.get<LeadFormResponsesResponse>(
      `/lead-forms/${formId}/responses`,
      { params }
    )
    return response.data
  },

  // Delete response
  deleteResponse: async (responseId: number) => {
    const response = await apiClient.delete(`/lead-form-responses/${responseId}`)
    return response.data
  },

  // Submit form (public endpoint)
  submit: async (data: LeadFormSubmission) => {
    const response = await apiClient.post('/lead-form-response', data)
    return response.data
  },

  // Check fingerprint (prevent duplicates)
  checkFingerprint: async (formId: number, fingerprint: string) => {
    const response = await apiClient.post('/lead-form-response/check-fingerprint', {
      formId,
      fingerprint,
    })
    return response.data
  },
}

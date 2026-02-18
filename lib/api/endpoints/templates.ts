/**
 * QR Code Templates API Endpoints
 */

import apiClient from '../client'
import type {
  QRCodeTemplate,
  TemplateCategory,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilters,
  UseTemplateInput,
} from '@/types/entities/template'

/**
 * Get all QR code templates
 */
export async function getTemplates(filters?: TemplateFilters): Promise<QRCodeTemplate[]> {
  const params = new URLSearchParams()
  
  if (filters?.category_id) params.append('category_id', filters.category_id.toString())
  if (filters?.type) params.append('type', filters.type)
  if (filters?.access_level && filters.access_level !== 'all') {
    params.append('access_level', filters.access_level)
  }
  if (filters?.search) params.append('search', filters.search)
  
  const queryString = params.toString()
  const endpoint = queryString ? `qrcode-templates?${queryString}` : 'qrcode-templates'
  
  const response = await apiClient.get(endpoint)
  return response.data
}

/**
 * Get a single template by ID
 */
export async function getTemplate(id: number): Promise<QRCodeTemplate> {
  const response = await apiClient.get(`qrcode-templates/${id}`)
  return response.data
}

/**
 * Get template categories
 */
export async function getTemplateCategories(): Promise<TemplateCategory[]> {
  const response = await apiClient.get('template-categories?no-pagination=true')
  return response.data
}

/**
 * Create a new template
 */
export async function createTemplate(input: CreateTemplateInput): Promise<QRCodeTemplate> {
  const response = await apiClient.post('qrcode-templates', input)
  return response.data
}

/**
 * Update an existing template
 */
export async function updateTemplate(input: UpdateTemplateInput): Promise<QRCodeTemplate> {
  const { id, ...data } = input
  const response = await apiClient.put(`qrcode-templates/${id}`, data)
  return response.data
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: number): Promise<void> {
  await apiClient.delete(`qrcode-templates/${id}`)
}

/**
 * Use a template to create a new QR code
 * Returns template data pre-filled for QR code creation
 */
export async function useTemplate(input: UseTemplateInput): Promise<Partial<any>> {
  const response = await apiClient.post('qrcode-templates/use', input)
  return response.data
}

/**
 * Check if templates are available
 */
export async function hasTemplates(): Promise<boolean> {
  try {
    const templates = await getTemplates()
    return templates.length > 0
  } catch {
    return false
  }
}

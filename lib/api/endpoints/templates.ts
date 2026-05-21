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
 * Purpose: Get all QR code templates
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Get a single template by ID
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getTemplate(id: number): Promise<QRCodeTemplate> {
  const response = await apiClient.get(`qrcode-templates/${id}`)
  return response.data
}

/**
 * Purpose: Get template categories
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getTemplateCategories(): Promise<TemplateCategory[]> {
  const response = await apiClient.get('template-categories?no-pagination=true')
  return response.data
}

/**
 * Purpose: Create a new template
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function createTemplate(input: CreateTemplateInput): Promise<QRCodeTemplate> {
  const response = await apiClient.post('qrcode-templates', input)
  return response.data
}

/**
 * Purpose: Update an existing template
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function updateTemplate(input: UpdateTemplateInput): Promise<QRCodeTemplate> {
  const { id, ...data } = input
  const response = await apiClient.put(`qrcode-templates/${id}`, data)
  return response.data
}

/**
 * Purpose: Delete a template
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function deleteTemplate(id: number): Promise<void> {
  await apiClient.delete(`qrcode-templates/${id}`)
}

/**
 * Purpose: Use a template to create a new QR code. Backend copies the template QR code and returns the new QR code object. Route: POST /qrcode-templates/{id}/use
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export async function useTemplate(input: UseTemplateInput): Promise<any> {
  const response = await apiClient.post(`qrcode-templates/${input.template_id}/use`, {
    name: input.name,
  })
  return response.data
}

/**
 * Purpose: Check if templates are available
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function hasTemplates(): Promise<boolean> {
  try {
    const templates = await getTemplates()
    return templates.length > 0
  } catch {
    return false
  }
}

/**
 * Purpose: Get a single template category by ID
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getTemplateCategory(id: number | string): Promise<TemplateCategory> {
  const response = await apiClient.get(`template-categories/${id}`)
  return response.data
}

/**
 * Purpose: Create a new template category
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function createTemplateCategory(data: { name: string; text_color?: string; sort_order?: number }): Promise<TemplateCategory> {
  const response = await apiClient.post('template-categories', data)
  return response.data
}

/**
 * Purpose: Update a template category
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function updateTemplateCategory(id: number | string, data: { name?: string; text_color?: string; sort_order?: number }): Promise<TemplateCategory> {
  const response = await apiClient.put(`template-categories/${id}`, data)
  return response.data
}

/**
 * Purpose: Delete a template category
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function deleteTemplateCategory(id: number | string): Promise<void> {
  await apiClient.delete(`template-categories/${id}`)
}

/**
 * NewQRFormAdapter (T364)
 *
 * Adapter utilities for converting between React Hook Form data and API format.
 * Handles field mapping, type conversions, and optional fields.
 */

export interface QRFormData {
  name: string
  type: string
  targetUrl?: string
  foregroundColor?: string
  backgroundColor?: string
  logoUrl?: string
  size?: number
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  isActive?: boolean
  folderId?: number | null
  customFields?: Record<string, unknown>
}

export interface QRApiData {
  qrcode_name: string
  qrcode_type: string
  target_url?: string
  foreground_color?: string
  background_color?: string
  logo_url?: string
  size?: number
  error_correction?: string
  is_active?: number // API uses 0/1
  folder_id?: number | null
  custom_fields?: Record<string, unknown>
}

/**
 * Convert React Hook Form data to API request format.
 */
export function adaptFormToAPI(formData: QRFormData): QRApiData {
  const apiData: QRApiData = {
    qrcode_name: formData.name,
    qrcode_type: formData.type,
  }

  if (formData.targetUrl !== undefined) apiData.target_url = formData.targetUrl
  if (formData.foregroundColor !== undefined) apiData.foreground_color = formData.foregroundColor
  if (formData.backgroundColor !== undefined) apiData.background_color = formData.backgroundColor
  if (formData.logoUrl !== undefined) apiData.logo_url = formData.logoUrl
  if (formData.size !== undefined) apiData.size = formData.size
  if (formData.errorCorrection !== undefined) apiData.error_correction = formData.errorCorrection
  if (formData.isActive !== undefined) apiData.is_active = formData.isActive ? 1 : 0
  if (formData.folderId !== undefined) apiData.folder_id = formData.folderId
  if (formData.customFields !== undefined) apiData.custom_fields = formData.customFields

  return apiData
}

/**
 * Convert API response to React Hook Form data format.
 */
export function adaptAPIToForm(apiData: QRApiData): QRFormData {
  const formData: QRFormData = {
    name: apiData.qrcode_name,
    type: apiData.qrcode_type,
  }

  if (apiData.target_url !== undefined) formData.targetUrl = apiData.target_url
  if (apiData.foreground_color !== undefined) formData.foregroundColor = apiData.foreground_color
  if (apiData.background_color !== undefined) formData.backgroundColor = apiData.background_color
  if (apiData.logo_url !== undefined) formData.logoUrl = apiData.logo_url
  if (apiData.size !== undefined) formData.size = apiData.size
  if (apiData.error_correction !== undefined) {
    formData.errorCorrection = apiData.error_correction as QRFormData['errorCorrection']
  }
  if (apiData.is_active !== undefined) formData.isActive = apiData.is_active === 1
  if (apiData.folder_id !== undefined) formData.folderId = apiData.folder_id
  if (apiData.custom_fields !== undefined) formData.customFields = apiData.custom_fields

  return formData
}

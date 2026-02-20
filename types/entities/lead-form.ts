// Lead Form Entity Types

export interface LeadForm {
  id: number
  name: string
  description: string | null
  slug: string
  fields: LeadFormField[]
  settings: FormSettings
  isActive: boolean
  responseCount: number
  userId: number
  qrcode_name?: string
  createdAt: string
  updatedAt: string
}

export interface LeadFormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date'
  label: string
  name: string
  placeholder?: string
  required: boolean
  options?: string[] // for select, radio, checkbox
  validation?: ValidationRule
  order: number
}

export interface ValidationRule {
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number // for number/date
  max?: number
  custom?: string
}

export interface FormSettings {
  submitButtonText: string
  successMessage: string
  redirectUrl?: string
  sendEmail: boolean
  emailRecipients?: string[]
  allowDuplicates: boolean
  captchaEnabled: boolean
}

export interface LeadFormResponseField {
  question: string
  value: string | number | null
}

export interface LeadFormResponse {
  id: number
  leadFormId: number
  data: Record<string, unknown>
  fields?: LeadFormResponseField[]
  fingerprint: string | null
  ipAddress: string | null
  userAgent: string | null
  source: string | null
  createdAt: string
}

export interface LeadFormSubmission {
  formId: number
  data: Record<string, any>
  fingerprint?: string
}

// API Response Types
export interface LeadFormsResponse {
  data: LeadForm[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface LeadFormResponsesResponse {
  data: LeadFormResponse[]
  pagination: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

// Form Builder Types
export interface FormBuilderField extends LeadFormField {
  isEditing?: boolean
}

export interface FormBuilderState {
  fields: FormBuilderField[]
  settings: FormSettings
}

// Create/Update DTOs
export interface CreateLeadFormRequest {
  name: string
  description?: string
  fields: Omit<LeadFormField, 'id'>[]
  settings: FormSettings
  isActive?: boolean
}

export interface UpdateLeadFormRequest extends Partial<CreateLeadFormRequest> {
  id: number
}

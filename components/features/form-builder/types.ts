// Form Builder Type Definitions

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'date'
  | 'number'

export interface FormFieldValidation {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  maxFileSize?: number // in bytes
  allowedFileTypes?: string[] // e.g., ['image/png', 'application/pdf']
}

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required: boolean
  helpText?: string
  validation?: FormFieldValidation
  options?: FormFieldOption[] // For select, radio, checkbox group
  defaultValue?: string
}

export interface FormSettings {
  title: string
  description?: string
  submitButtonText: string
  successMessage: string
  notificationEmail?: string
  redirectUrl?: string
  enableRecaptcha: boolean
}

export interface FormConfig {
  id?: number
  fields: FormField[]
  settings: FormSettings
  createdAt?: string
  updatedAt?: string
}

export interface FormResponse {
  id: number
  formId: number
  fields: Array<{
    fieldId: string
    name: string
    value: string
  }>
  createdAt: string
  ipAddress?: string
}

export const DEFAULT_FORM_SETTINGS: FormSettings = {
  title: 'Contact Form',
  description: '',
  submitButtonText: 'Submit',
  successMessage: 'Thank you! Your response has been submitted.',
  notificationEmail: '',
  redirectUrl: '',
  enableRecaptcha: false,
}

export const FIELD_TYPE_OPTIONS: Array<{ type: FormFieldType; label: string; icon: string }> = [
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'textarea', label: 'Textarea', icon: 'P' },
  { type: 'email', label: 'Email', icon: '@' },
  { type: 'phone', label: 'Phone', icon: '#' },
  { type: 'select', label: 'Dropdown', icon: 'V' },
  { type: 'checkbox', label: 'Checkbox', icon: 'X' },
  { type: 'radio', label: 'Radio', icon: 'O' },
  { type: 'file', label: 'File Upload', icon: 'F' },
  { type: 'date', label: 'Date', icon: 'D' },
  { type: 'number', label: 'Number', icon: 'N' },
]

/**
 * Purpose: Executes createFormField functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function createFormField(type: FormFieldType): FormField {
  const base: FormField = {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: '',
    placeholder: '',
    required: false,
    helpText: '',
  }

  switch (type) {
    case 'text':
      base.label = 'Text Field'
      base.placeholder = 'Enter text...'
      break
    case 'textarea':
      base.label = 'Message'
      base.placeholder = 'Enter your message...'
      break
    case 'email':
      base.label = 'Email'
      base.placeholder = 'email@example.com'
      break
    case 'phone':
      base.label = 'Phone Number'
      base.placeholder = '+1 (555) 123-4567'
      break
    case 'select':
      base.label = 'Select'
      base.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
      break
    case 'checkbox':
      base.label = 'Checkbox'
      base.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
      break
    case 'radio':
      base.label = 'Radio Group'
      base.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
      break
    case 'file':
      base.label = 'File Upload'
      base.validation = {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*', 'application/pdf'],
      }
      break
    case 'date':
      base.label = 'Date'
      break
    case 'number':
      base.label = 'Number'
      base.placeholder = '0'
      break
  }

  return base
}

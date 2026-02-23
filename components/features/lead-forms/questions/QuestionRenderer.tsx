'use client'

import type { LeadFormField } from '@/types/entities/lead-form'
import TextQuestion from './TextQuestion'
import TextareaQuestion from './TextareaQuestion'
import SelectQuestion from './SelectQuestion'
import CheckboxQuestion from './CheckboxQuestion'
import RadioQuestion from './RadioQuestion'
import FileQuestion from './FileQuestion'
import DateQuestion from './DateQuestion'
import RatingQuestion from './RatingQuestion'

interface QuestionRendererProps {
  field: LeadFormField
  value: unknown
  onChange: (value: unknown) => void
  error?: string
}

export default function QuestionRenderer({
  field,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const fieldId = `field-${field.id}`

  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'number':
      return (
        <TextQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'string' ? value : String(value ?? '')}
          onChange={onChange}
          placeholder={field.placeholder}
          required={field.required}
          error={error}
        />
      )

    case 'textarea':
      return (
        <TextareaQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'string' ? value : String(value ?? '')}
          onChange={onChange}
          placeholder={field.placeholder}
          required={field.required}
          error={error}
        />
      )

    case 'select':
    case 'choices':
      return (
        <SelectQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          options={field.options ?? []}
          placeholder={field.placeholder}
          required={field.required}
          error={error}
        />
      )

    case 'checkbox':
    case 'multi-choices':
      return (
        <CheckboxQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          options={field.options ?? []}
          required={field.required}
          error={error}
        />
      )

    case 'radio':
      return (
        <RadioQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          options={field.options ?? []}
          required={field.required}
          error={error}
        />
      )

    case 'date':
      return (
        <DateQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          required={field.required}
          error={error}
        />
      )

    case 'rating':
      return (
        <RatingQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'number' ? value : 0}
          onChange={(v) => onChange(v)}
          required={field.required}
          error={error}
          min={field.validation?.min ?? 1}
          max={field.validation?.max ?? 10}
          variant="number"
        />
      )

    case 'stars':
      return (
        <RatingQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={typeof value === 'number' ? value : 0}
          onChange={(v) => onChange(v)}
          required={field.required}
          error={error}
          min={1}
          max={field.validation?.max ?? 5}
          variant="stars"
        />
      )

    default:
      return (
        <FileQuestion
          id={fieldId}
          label={field.label}
          name={field.name}
          value={value instanceof File ? value : null}
          onChange={onChange}
          required={field.required}
          error={error}
        />
      )
  }
}

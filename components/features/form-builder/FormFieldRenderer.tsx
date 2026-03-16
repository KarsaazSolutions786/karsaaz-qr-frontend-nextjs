'use client'

import { forwardRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { FormField } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldRendererProps {
  field: FormField
  value: string | string[]
  onChange: (value: string | string[]) => void
  error?: string
  disabled?: boolean
}

/**
 * Renders a single form field based on its type.
 * Used in both the form builder preview and the public form renderer.
 */
const FormFieldRenderer = forwardRef<HTMLInputElement, FormFieldRendererProps>(
  ({ field, value, onChange, error, disabled }, ref) => {
    const { t } = useTranslation();
    const fieldId = `form-field-${field.id}`
    const hasError = !!error

    const renderField = () => {
      switch (field.type) {
        case 'text':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
          )

        case 'textarea':
          return (
            <textarea
              id={fieldId}
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              rows={4}
              className={cn(
                'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
                'placeholder:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
          )

        case 'email':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="email"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'email@example.com'}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
            />
          )

        case 'phone':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="tel"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || '+1 (555) 123-4567'}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
            />
          )

        case 'number':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="number"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || '0'}
              disabled={disabled}
              min={field.validation?.min}
              max={field.validation?.max}
              className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
            />
          )

        case 'date':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="date"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500')}
            />
          )

        case 'select':
          return (
            <select
              id={fieldId}
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100',
                hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            >
              <option value="">{t('Select an option...')}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )

        case 'checkbox':
          return (
            <div className="space-y-2">
              {field.options?.map((option) => {
                const selectedValues = Array.isArray(value) ? value : []
                const isChecked = selectedValues.includes(option.value)

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange([...selectedValues, option.value])
                        } else {
                          onChange(selectedValues.filter((v) => v !== option.value))
                        }
                      }}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                )
              })}
            </div>
          )

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={fieldId}
                    checked={(value as string) === option.value}
                    onChange={() => onChange(option.value)}
                    disabled={disabled}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          )

        case 'file':
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                onChange(file?.name || '')
              }}
              disabled={disabled}
              accept={field.validation?.allowedFileTypes?.join(',')}
              className={cn(
                'file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100',
                hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
          )

        default:
          return (
            <Input
              ref={ref}
              id={fieldId}
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
            />
          )
      }
    }

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId} className="flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        {renderField()}
        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

FormFieldRenderer.displayName = 'FormFieldRenderer'

export default FormFieldRenderer

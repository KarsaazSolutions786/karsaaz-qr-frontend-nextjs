'use client'

import { useTranslation } from '@/lib/i18n'
import type { FormField, FormFieldOption, FormFieldType } from './types'
import { FIELD_TYPE_OPTIONS } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface FieldSettingsPanelProps {
  field: FormField | null
  onUpdate: (field: FormField) => void
}

export default function FieldSettingsPanel({ field, onUpdate }: FieldSettingsPanelProps) {
  const { t } = useTranslation();

  if (!field) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <div className="text-3xl text-gray-300">&#9881;</div>
          <p className="text-sm text-gray-500">
            {t('Select a field to edit its settings')}
          </p>
        </div>
      </div>
    )
  }

  const update = (changes: Partial<FormField>) => {
    onUpdate({ ...field, ...changes })
  }

  const hasOptions = field.type === 'select' || field.type === 'checkbox' || field.type === 'radio'

  const addOption = () => {
    const options = field.options || []
    const newOption: FormFieldOption = {
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
    }
    update({ options: [...options, newOption] })
  }

  const updateOption = (index: number, changes: Partial<FormFieldOption>) => {
    const options = [...(field.options || [])]
    const existing = options[index]
    if (!existing) return
    options[index] = { ...existing, ...changes }
    update({ options })
  }

  const removeOption = (index: number) => {
    const options = (field.options || []).filter((_, i) => i !== index)
    update({ options })
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {t('Field Settings')}
      </h3>

      {/* Field Type */}
      <div className="space-y-1.5">
        <Label>{t('Type')}</Label>
        <select
          value={field.type}
          onChange={(e) => update({ type: e.target.value as FormFieldType })}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {FIELD_TYPE_OPTIONS.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Label */}
      <div className="space-y-1.5">
        <Label>{t('Label')}</Label>
        <Input
          value={field.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Field label"
        />
      </div>

      {/* Placeholder */}
      {field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'file' && (
        <div className="space-y-1.5">
          <Label>{t('Placeholder')}</Label>
          <Input
            value={field.placeholder || ''}
            onChange={(e) => update({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>
      )}

      {/* Required */}
      <div className="flex items-center justify-between">
        <Label>{t('Required')}</Label>
        <Switch
          checked={field.required}
          onCheckedChange={(checked) => update({ required: checked })}
        />
      </div>

      {/* Help Text */}
      <div className="space-y-1.5">
        <Label>{t('Help Text')}</Label>
        <Input
          value={field.helpText || ''}
          onChange={(e) => update({ helpText: e.target.value })}
          placeholder="Optional help text"
        />
      </div>

      {/* Validation Rules */}
      {(field.type === 'text' || field.type === 'textarea') && (
        <div className="space-y-3 rounded-md border border-gray-200 p-3">
          <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">{t('Validation')}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">{t('Min Length')}</Label>
              <Input
                type="number"
                min={0}
                value={field.validation?.minLength ?? ''}
                onChange={(e) =>
                  update({
                    validation: {
                      ...field.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('Max Length')}</Label>
              <Input
                type="number"
                min={0}
                value={field.validation?.maxLength ?? ''}
                onChange={(e) =>
                  update({
                    validation: {
                      ...field.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="Unlimited"
              />
            </div>
          </div>
        </div>
      )}

      {field.type === 'number' && (
        <div className="space-y-3 rounded-md border border-gray-200 p-3">
          <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">{t('Validation')}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">{t('Min Value')}</Label>
              <Input
                type="number"
                value={field.validation?.min ?? ''}
                onChange={(e) =>
                  update({
                    validation: {
                      ...field.validation,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="No min"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('Max Value')}</Label>
              <Input
                type="number"
                value={field.validation?.max ?? ''}
                onChange={(e) =>
                  update({
                    validation: {
                      ...field.validation,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="No max"
              />
            </div>
          </div>
        </div>
      )}

      {/* Options (for select, checkbox, radio) */}
      {hasOptions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{t('Options')}</Label>
            <button
              type="button"
              onClick={addOption}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {t('+ Add Option')}
            </button>
          </div>
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(index, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                  title="Remove option"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

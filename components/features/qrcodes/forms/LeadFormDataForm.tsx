'use client'

import { useState, useCallback } from 'react'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { leadFormDataSchema } from '@/lib/validations/qrcode'
import { FormSettingsPanel } from '@/components/features/qrcodes/types/lead-form/FormSettingsPanel'
import type { FormSettings } from '@/types/entities/lead-form'
import { z } from 'zod'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type LeadFormData = z.infer<typeof leadFormDataSchema>

interface LeadFormDataFormProps {
  defaultValues?: Partial<LeadFormData>
  onChange?: (data: Partial<LeadFormData>) => void
}

const DEFAULT_FORM_SETTINGS: FormSettings = {
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your submission!',
  redirectUrl: undefined,
  sendEmail: false,
  emailRecipients: [],
  allowDuplicates: false,
  captchaEnabled: false,
}

/**
 * Purpose: Executes LeadFormDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function LeadFormDataForm({ defaultValues, onChange }: LeadFormDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<LeadFormData>({ schema: leadFormDataSchema, defaultValues, onChange })

  const [showSettings, setShowSettings] = useState(false)
  const [formSettings, setFormSettings] = useState<FormSettings>(() => {
    const existing = (defaultValues as Record<string, unknown> | undefined)?.settings
    if (existing && typeof existing === 'object') {
      return { ...DEFAULT_FORM_SETTINGS, ...(existing as Partial<FormSettings>) }
    }
    return { ...DEFAULT_FORM_SETTINGS }
  })

  // Propagate settings changes up to the parent form
  const handleSettingsChange = useCallback(
    (settings: FormSettings) => {
      setFormSettings(settings)
      onChange?.({ ...defaultValues, settings } as Partial<LeadFormData>)
    },
    [defaultValues, onChange]
  )

  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="form_name" className={LABEL}>
          {t('Form Name')} *
        </label>
        <input
          {...register('form_name')}
          id="form_name"
          type="text"
          placeholder={t('Feedback Collection')}
          className={INPUT}
        />
        {errors.form_name && <p className={ERROR}>{errors.form_name.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          {t('Expiry Date')}
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>

      {/* Collapsible Form Settings */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSettings(prev => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>{t('Form Settings (notifications, redirect, security)')}</span>
          {showSettings ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {showSettings && (
          <div className="px-4 pb-4 pt-1 border-t border-gray-100">
            <FormSettingsPanel settings={formSettings} onChange={handleSettingsChange} />
          </div>
        )}
      </div>

      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700">
        {t('After creating the QR code, you can configure the form fields and design in the Lead Forms section of the dashboard.')}
      </div>
    </form>
  )
}

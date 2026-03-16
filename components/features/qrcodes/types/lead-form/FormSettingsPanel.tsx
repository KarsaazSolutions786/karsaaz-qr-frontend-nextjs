'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { Switch } from '@/components/ui/switch'
import {
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import type { FormSettings } from '@/types/entities/lead-form'

/**
 * Form Settings Panel -- configures form behavior for lead-form QR codes.
 *
 * Settings include:
 *  - Email notification toggle + recipient email(s)
 *  - Custom success message
 *  - Redirect URL after submission
 *  - reCAPTCHA / CAPTCHA toggle
 *  - Allow duplicate submissions toggle
 *  - Submit button text
 *
 * These settings are stored in the QR code's `data.settings` JSON field.
 * This component is designed to be embedded in the lead-form type configuration
 * in the QR wizard (Step2 or similar).
 */

interface FormSettingsPanelProps {
  settings: FormSettings
  onChange: (settings: FormSettings) => void
}

export function FormSettingsPanel({ settings, onChange }: FormSettingsPanelProps) {
  const { t } = useTranslation()
  const [newEmail, setNewEmail] = useState('')

  const update = useCallback(
    <K extends keyof FormSettings>(field: K, value: FormSettings[K]) => {
      onChange({ ...settings, [field]: value })
    },
    [settings, onChange]
  )

  // Email recipients management
  const addEmailRecipient = useCallback(() => {
    const trimmed = newEmail.trim().toLowerCase()
    if (!trimmed) return
    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return

    const current = settings.emailRecipients ?? []
    if (current.includes(trimmed)) {
      setNewEmail('')
      return
    }
    update('emailRecipients', [...current, trimmed])
    setNewEmail('')
  }, [newEmail, settings.emailRecipients, update])

  const removeEmailRecipient = useCallback(
    (email: string) => {
      const current = settings.emailRecipients ?? []
      update(
        'emailRecipients',
        current.filter(e => e !== email)
      )
    },
    [settings.emailRecipients, update]
  )

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEmailRecipient()
    }
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <InformationCircleIcon className="h-5 w-5 text-indigo-500" />
        <div>
          <h3 className="text-base font-semibold text-gray-900">{t('Form Settings')}</h3>
          <p className="text-xs text-gray-500">
            {t('Configure form behavior, notifications, and security')}
          </p>
        </div>
      </div>

      {/* Submit Button Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Submit Button Text')}
        </label>
        <input
          type="text"
          value={settings.submitButtonText || ''}
          onChange={e => update('submitButtonText', e.target.value)}
          placeholder={t('Submit')}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Email Notifications */}
      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-700">{t('Email Notifications')}</label>
              <p className="text-xs text-gray-500">{t('Send an email when a form is submitted')}</p>
            </div>
          </div>
          <Switch
            checked={settings.sendEmail}
            onCheckedChange={checked => update('sendEmail', checked)}
          />
        </div>

        {settings.sendEmail && (
          <div className="space-y-3 pl-7">
            {/* Recipient emails */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('Recipient Email Addresses')}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  placeholder="name@example.com"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addEmailRecipient}
                  disabled={!newEmail.trim()}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  {t('Add')}
                </button>
              </div>

              {/* Email chips */}
              {(settings.emailRecipients?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.emailRecipients!.map(email => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmailRecipient(email)}
                        className="rounded-full p-0.5 hover:bg-indigo-200 transition-colors"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {(settings.emailRecipients?.length ?? 0) === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  {t('Add at least one recipient to receive form notifications.')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">{t('Success Message')}</label>
        </div>
        <textarea
          value={settings.successMessage || ''}
          onChange={e => update('successMessage', e.target.value)}
          placeholder={t('Thank you for your submission!')}
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500">
          {t('Shown to the user after they submit the form (unless a redirect URL is set).')}
        </p>
      </div>

      {/* Redirect URL */}
      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">{t('Redirect URL (Optional)')}</label>
        </div>
        <input
          type="url"
          value={settings.redirectUrl || ''}
          onChange={e => update('redirectUrl', e.target.value || undefined)}
          placeholder="https://example.com/thank-you"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500">
          {t('If set, the user will be redirected to this URL after submission instead of seeing the success message.')}
        </p>
      </div>

      {/* Security Settings */}
      <div className="rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
          <h4 className="text-sm font-medium text-gray-700">{t('Security')}</h4>
        </div>

        {/* CAPTCHA */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-700">{t('Enable reCAPTCHA')}</label>
            <p className="text-xs text-gray-500">
              {t('Helps prevent spam and bot submissions')}
            </p>
          </div>
          <Switch
            checked={settings.captchaEnabled}
            onCheckedChange={checked => update('captchaEnabled', checked)}
          />
        </div>

        {settings.captchaEnabled && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            {t('reCAPTCHA requires a site key to be configured in System Settings > Authentication. Ensure the reCAPTCHA v2/v3 keys are set before enabling this.')}
          </div>
        )}

        {/* Allow Duplicates */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm text-gray-700">{t('Allow Duplicate Submissions')}</label>
            <p className="text-xs text-gray-500">
              {t('Allow the same user to submit the form multiple times')}
            </p>
          </div>
          <Switch
            checked={settings.allowDuplicates}
            onCheckedChange={checked => update('allowDuplicates', checked)}
          />
        </div>
      </div>
    </div>
  )
}

export default FormSettingsPanel

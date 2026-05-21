'use client'

import { useTranslation } from '@/lib/i18n'
import type { FormSettings } from './types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface FormSettingsPanelProps {
  settings: FormSettings
  onUpdate: (settings: FormSettings) => void
}

/**
 * Purpose: Executes FormSettingsPanel functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function FormSettingsPanel({ settings, onUpdate }: FormSettingsPanelProps) {
  const { t } = useTranslation();
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const update = (changes: Partial<FormSettings>) => {
    onUpdate({ ...settings, ...changes })
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">{t('Form Settings')}</h3>

      {/* Form Title */}
      <div className="space-y-1.5">
        <Label>{t('Form Title')}</Label>
        <Input
          value={settings.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder={t('Enter form title')}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label>{t('Description')}</Label>
        <textarea
          value={settings.description || ''}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional form description"
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button Text */}
      <div className="space-y-1.5">
        <Label>{t('Submit Button Text')}</Label>
        <Input
          value={settings.submitButtonText}
          onChange={(e) => update({ submitButtonText: e.target.value })}
          placeholder="Submit"
        />
      </div>

      {/* Success Message */}
      <div className="space-y-1.5">
        <Label>{t('Success Message')}</Label>
        <textarea
          value={settings.successMessage}
          onChange={(e) => update({ successMessage: e.target.value })}
          placeholder="Thank you for your submission!"
          rows={2}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Email Notification */}
      <div className="space-y-1.5">
        <Label>{t('Notification Email')}</Label>
        <Input
          type="email"
          value={settings.notificationEmail || ''}
          onChange={(e) => update({ notificationEmail: e.target.value })}
          placeholder="admin@example.com"
        />
        <p className="text-xs text-gray-500">
          {t('Receive email notifications when the form is submitted')}
        </p>
      </div>

      {/* Redirect URL */}
      <div className="space-y-1.5">
        <Label>{t('Redirect URL After Submit')}</Label>
        <Input
          type="url"
          value={settings.redirectUrl || ''}
          onChange={(e) => update({ redirectUrl: e.target.value })}
          placeholder="https://example.com/thank-you"
        />
        <p className="text-xs text-gray-500">
          {t('Leave empty to show the success message instead')}
        </p>
      </div>

      {/* reCAPTCHA */}
      <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
        <div>
          <Label>reCAPTCHA</Label>
          <p className="text-xs text-gray-500">{t('Protect against spam submissions')}</p>
        </div>
        <Switch
          checked={settings.enableRecaptcha}
          onCheckedChange={(checked) => update({ enableRecaptcha: checked })}
        />
      </div>
    </div>
  )
}

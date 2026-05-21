'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface LeadFormDesignSettings extends DesignSettings {
  // Lead Form-specific settings
  formLayout?: 'single-column' | 'two-column' | 'compact'
  formStyle?: 'card' | 'minimal' | 'bordered' | 'floating'
  submitButtonText?: string
  submitButtonColor?: string
  submitButtonTextColor?: string
  showRequiredIndicator?: boolean
  requiredIndicatorStyle?: 'asterisk' | 'text' | 'color'
  inputStyle?: 'underline' | 'bordered' | 'filled'
  inputBorderRadius?: number
  showLabels?: boolean
  labelPosition?: 'above' | 'inside' | 'floating'
  successRedirectUrl?: string
  showSuccessMessage?: boolean
  successMessage?: string
  enableCaptcha?: boolean
  showPrivacyPolicy?: boolean
  privacyPolicyUrl?: string
  formBackgroundColor?: string
  inputBackgroundColor?: string
  inputBorderColor?: string
  labelColor?: string
}

interface LeadFormDesignerProps {
  design: LeadFormDesignSettings
  onChange: (design: LeadFormDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'form', label: 'Form Design', icon: '📋' },
  { id: 'behavior', label: 'Behavior', icon: '⚙️' },
]

/**
 * Purpose: Executes LeadFormDesigner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function LeadFormDesigner({ design, onChange }: LeadFormDesignerProps) {
  const { t } = useTranslation()
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateDesign = (updates: Partial<LeadFormDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  /**
   * Purpose: Executes renderFormDesignContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderFormDesignContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Form Design')}</h4>

      {/* Form Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Form Layout')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'single-column', label: t('Single Column') },
            { value: 'two-column', label: t('Two Column') },
            { value: 'compact', label: t('Compact') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({ formLayout: option.value as LeadFormDesignSettings['formLayout'] })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.formLayout === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Form Style')}</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'card', label: t('Card') },
            { value: 'minimal', label: t('Minimal') },
            { value: 'bordered', label: t('Bordered') },
            { value: 'floating', label: t('Floating') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({ formStyle: option.value as LeadFormDesignSettings['formStyle'] })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.formStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Input Style')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'underline', label: t('Underline') },
            { value: 'bordered', label: t('Bordered') },
            { value: 'filled', label: t('Filled') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({ inputStyle: option.value as LeadFormDesignSettings['inputStyle'] })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.inputStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Label Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showLabels"
            checked={design.showLabels ?? true}
            onChange={e => updateDesign({ showLabels: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showLabels" className="text-sm text-gray-700">
            {t('Show Labels')}
          </label>
        </div>

        {design.showLabels && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Label Position')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'above', label: t('Above Input') },
                { value: 'inside', label: t('Inside Input') },
                { value: 'floating', label: t('Floating') },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      labelPosition: option.value as LeadFormDesignSettings['labelPosition'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.labelPosition === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Required Indicator */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showRequiredIndicator"
            checked={design.showRequiredIndicator ?? true}
            onChange={e => updateDesign({ showRequiredIndicator: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showRequiredIndicator" className="text-sm text-gray-700">
            {t('Show Required Indicator')}
          </label>
        </div>

        {design.showRequiredIndicator && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Indicator Style')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'asterisk', label: t('* Asterisk') },
                { value: 'text', label: t('(Required)') },
                { value: 'color', label: t('Red Border') },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      requiredIndicatorStyle:
                        option.value as LeadFormDesignSettings['requiredIndicatorStyle'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.requiredIndicatorStyle === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">{t('Submit Button')}</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text')}</label>
          <input
            type="text"
            value={design.submitButtonText || t('Submit')}
            onChange={e => updateDesign({ submitButtonText: e.target.value })}
            placeholder={t('Submit')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.submitButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ submitButtonColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.submitButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ submitButtonColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.submitButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ submitButtonTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.submitButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ submitButtonTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Form Colors */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">{t('Form Colors')}</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Form Background')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.formBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ formBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.formBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ formBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Input Background')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.inputBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ inputBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.inputBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ inputBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Input Border Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.inputBorderColor || '#d1d5db'}
              onChange={e => updateDesign({ inputBorderColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.inputBorderColor || '#d1d5db'}
              onChange={e => updateDesign({ inputBorderColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Purpose: Executes renderBehaviorContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderBehaviorContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Form Behavior')}</h4>

      {/* Success Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSuccessMessage"
            checked={design.showSuccessMessage ?? true}
            onChange={e => updateDesign({ showSuccessMessage: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showSuccessMessage" className="text-sm text-gray-700">
            {t('Show Success Message')}
          </label>
        </div>

        {design.showSuccessMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Success Message')}</label>
            <input
              type="text"
              value={design.successMessage || t('Thank you for your submission!')}
              onChange={e => updateDesign({ successMessage: e.target.value })}
              placeholder={t('Thank you for your submission!')}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Success Redirect URL (Optional)')}
          </label>
          <input
            type="url"
            value={design.successRedirectUrl || ''}
            onChange={e => updateDesign({ successRedirectUrl: e.target.value })}
            placeholder="https://example.com/thank-you"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">{t('Leave empty to show success message instead')}</p>
        </div>
      </div>

      {/* Security */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="enableCaptcha"
          checked={design.enableCaptcha ?? false}
          onChange={e => updateDesign({ enableCaptcha: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="enableCaptcha" className="text-sm text-gray-700">
          {t('Enable CAPTCHA')}
        </label>
      </div>

      {/* Privacy Policy */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPrivacyPolicy"
            checked={design.showPrivacyPolicy ?? false}
            onChange={e => updateDesign({ showPrivacyPolicy: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showPrivacyPolicy" className="text-sm text-gray-700">
            {t('Show Privacy Policy Link')}
          </label>
        </div>

        {design.showPrivacyPolicy && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('Privacy Policy URL')}
            </label>
            <input
              type="url"
              value={design.privacyPolicyUrl || ''}
              onChange={e => updateDesign({ privacyPolicyUrl: e.target.value })}
              placeholder="https://example.com/privacy"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderFormDesignContent()}
      {renderBehaviorContent()}
    </BaseDesigner>
  )
}

export default LeadFormDesigner

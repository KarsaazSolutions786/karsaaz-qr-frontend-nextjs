'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

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

export function LeadFormDesigner({ design, onChange }: LeadFormDesignerProps) {
  const updateDesign = (updates: Partial<LeadFormDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderFormDesignContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Form Design</h4>

      {/* Form Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Layout</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'single-column', label: 'Single Column' },
            { value: 'two-column', label: 'Two Column' },
            { value: 'compact', label: 'Compact' },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Style</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'card', label: 'Card' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'floating', label: 'Floating' },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Input Style</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'underline', label: 'Underline' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'filled', label: 'Filled' },
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
            Show Labels
          </label>
        </div>

        {design.showLabels && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label Position</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'above', label: 'Above Input' },
                { value: 'inside', label: 'Inside Input' },
                { value: 'floating', label: 'Floating' },
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
            Show Required Indicator
          </label>
        </div>

        {design.showRequiredIndicator && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Indicator Style</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'asterisk', label: '* Asterisk' },
                { value: 'text', label: '(Required)' },
                { value: 'color', label: 'Red Border' },
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
        <h5 className="text-sm font-medium text-gray-700">Submit Button</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={design.submitButtonText || 'Submit'}
            onChange={e => updateDesign({ submitButtonText: e.target.value })}
            placeholder="Submit"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text Color</label>
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
        <h5 className="text-sm font-medium text-gray-700">Form Colors</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Form Background</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Background</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Border Color</label>
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

  const renderBehaviorContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Form Behavior</h4>

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
            Show Success Message
          </label>
        </div>

        {design.showSuccessMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
            <input
              type="text"
              value={design.successMessage || 'Thank you for your submission!'}
              onChange={e => updateDesign({ successMessage: e.target.value })}
              placeholder="Thank you for your submission!"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Success Redirect URL (Optional)
          </label>
          <input
            type="url"
            value={design.successRedirectUrl || ''}
            onChange={e => updateDesign({ successRedirectUrl: e.target.value })}
            placeholder="https://example.com/thank-you"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to show success message instead</p>
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
          Enable CAPTCHA
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
            Show Privacy Policy Link
          </label>
        </div>

        {design.showPrivacyPolicy && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Policy URL
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

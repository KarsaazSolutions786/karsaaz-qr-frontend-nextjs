'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface BusinessReviewDesignSettings extends DesignSettings {
  // Business Review-specific settings
  pageTitle?: string
  placeholderText?: string
  sendButtonText?: string
  successMessage?: string
  sendButtonBackgroundColor?: string
  sendButtonTextColor?: string
  recipientEmail?: string
  emailSubject?: string
  showLogo?: boolean
  logoPosition?: 'left' | 'center' | 'right'
  formStyle?: 'card' | 'minimal' | 'bordered'
  ratingStyle?: 'stars' | 'emoji' | 'numbers'
  showRatingLabels?: boolean
}

interface BusinessReviewDesignerProps {
  design: BusinessReviewDesignSettings
  onChange: (design: BusinessReviewDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'form', label: 'Form Settings', icon: '📋' },
  { id: 'feedback', label: 'Feedback', icon: '⭐' },
]

export function BusinessReviewDesigner({ design, onChange }: BusinessReviewDesignerProps) {
  const { t } = useTranslation()
  const updateDesign = (updates: Partial<BusinessReviewDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderFormSettingsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Logo & Form')}</h4>

      {/* Logo Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showLogo"
            checked={design.showLogo ?? true}
            onChange={e => updateDesign({ showLogo: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showLogo" className="text-sm text-gray-700">
            {t('Show Logo')}
          </label>
        </div>

        {design.showLogo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Logo Position')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'left', label: t('Left') },
                { value: 'center', label: t('Center') },
                { value: 'right', label: t('Right') },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      logoPosition: option.value as BusinessReviewDesignSettings['logoPosition'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.logoPosition === option.value
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

      {/* {t('Form Style')} */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Form Style')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'card', label: t('Card') },
            { value: 'minimal', label: t('Minimal') },
            { value: 'bordered', label: t('Bordered') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  formStyle: option.value as BusinessReviewDesignSettings['formStyle'],
                })
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

      {/* {t('Rating Style')} */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('Rating Style')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'stars', label: '⭐ Stars' },
              { value: 'emoji', label: '😀 Emoji' },
              { value: 'numbers', label: '🔢 Numbers' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    ratingStyle: option.value as BusinessReviewDesignSettings['ratingStyle'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.ratingStyle === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showRatingLabels"
            checked={design.showRatingLabels ?? true}
            onChange={e => updateDesign({ showRatingLabels: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showRatingLabels" className="text-sm text-gray-700">
            {t('Show Rating Labels')}
          </label>
        </div>
      </div>

      {/* Form Text Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Page Title')}</label>
          <input
            type="text"
            value={design.pageTitle || ''}
            onChange={e => updateDesign({ pageTitle: e.target.value })}
            placeholder={t('Enter page title')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Placeholder Text')}</label>
          <input
            type="text"
            value={design.placeholderText || ''}
            onChange={e => updateDesign({ placeholderText: e.target.value })}
            placeholder={t('Enter placeholder text')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Send Button Text')}</label>
          <input
            type="text"
            value={design.sendButtonText || t('Send Feedback')}
            onChange={e => updateDesign({ sendButtonText: e.target.value })}
            placeholder={t('Send Feedback')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Success Message')}</label>
          <input
            type="text"
            value={design.successMessage || ''}
            onChange={e => updateDesign({ successMessage: e.target.value })}
            placeholder={t('Thank you for your feedback!')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Button Colors */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Send Button Background')}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.sendButtonBackgroundColor || '#3b82f6'}
              onChange={e => updateDesign({ sendButtonBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.sendButtonBackgroundColor || '#3b82f6'}
              onChange={e => updateDesign({ sendButtonBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Send Button Text Color')}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.sendButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ sendButtonTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.sendButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ sendButtonTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderFeedbackSettingsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Feedback Settings')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Recipient Email')}</label>
        <input
          type="email"
          value={design.recipientEmail || ''}
          onChange={e => updateDesign({ recipientEmail: e.target.value })}
          placeholder={t('Comma separated recipient emails')}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">{t('Separate multiple emails with commas')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email Subject')}</label>
        <input
          type="text"
          value={design.emailSubject || ''}
          onChange={e => updateDesign({ emailSubject: e.target.value })}
          placeholder={t('New feedback received')}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderFormSettingsContent()}
      {renderFeedbackSettingsContent()}
    </BaseDesigner>
  )
}

export default BusinessReviewDesigner

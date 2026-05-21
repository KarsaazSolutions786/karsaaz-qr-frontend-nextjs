'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface UPIDynamicDesignSettings extends DesignSettings {
  // UPI Dynamic-specific settings
  pageTitle?: string
  pageText?: string
  payButtonText?: string
  payButtonBackgroundColor?: string
  payButtonTextColor?: string
  showLogo?: boolean
  logoPosition?: 'left' | 'center' | 'right'
  showPaymentMethods?: boolean
  showSecurityBadge?: boolean
  formStyle?: 'card' | 'minimal' | 'bordered'
}

interface UPIDynamicDesignerProps {
  design: UPIDynamicDesignSettings
  onChange: (design: UPIDynamicDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'payment', label: 'Payment Page', icon: '💳' },
]

/**
 * Purpose: Executes UPIDynamicDesigner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function UPIDynamicDesigner({ design, onChange }: UPIDynamicDesignerProps) {
  const { t } = useTranslation()
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateDesign = (updates: Partial<UPIDynamicDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  /**
   * Purpose: Executes renderPaymentPageContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderPaymentPageContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Payment Page Settings')}</h4>

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
                      logoPosition: option.value as UPIDynamicDesignSettings['logoPosition'],
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

      {/* Form Style */}
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
                updateDesign({ formStyle: option.value as UPIDynamicDesignSettings['formStyle'] })
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

      {/* Page Content */}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Page Text')}</label>
          <textarea
            value={design.pageText || ''}
            onChange={e => updateDesign({ pageText: e.target.value })}
            placeholder={t('Enter description or instructions')}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
      </div>

      {/* Pay Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">{t('Pay Button')}</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text')}</label>
          <input
            type="text"
            value={design.payButtonText || t('Pay Now')}
            onChange={e => updateDesign({ payButtonText: e.target.value })}
            placeholder={t('Pay Now')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Button Background Color')}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.payButtonBackgroundColor || '#10b981'}
              onChange={e => updateDesign({ payButtonBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.payButtonBackgroundColor || '#10b981'}
              onChange={e => updateDesign({ payButtonBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.payButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ payButtonTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.payButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ payButtonTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPaymentMethods"
            checked={design.showPaymentMethods ?? true}
            onChange={e => updateDesign({ showPaymentMethods: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showPaymentMethods" className="text-sm text-gray-700">
            {t('Show Payment Method Icons')}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSecurityBadge"
            checked={design.showSecurityBadge ?? true}
            onChange={e => updateDesign({ showSecurityBadge: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showSecurityBadge" className="text-sm text-gray-700">
            {t('Show Security Badge')}
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderPaymentPageContent()}
    </BaseDesigner>
  )
}

export default UPIDynamicDesigner

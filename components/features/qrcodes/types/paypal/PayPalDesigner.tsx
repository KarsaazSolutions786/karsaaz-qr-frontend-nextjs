'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface PayPalDesignSettings extends DesignSettings {
  paymentCardStyle?: 'standard' | 'modern' | 'minimal'
  showItemDetails?: boolean
  showSecurityBadge?: boolean
  paypalButtonStyle?: 'blue' | 'gold' | 'silver' | 'white' | 'black'
  confirmationRequired?: boolean
}

interface PayPalDesignerProps {
  design: PayPalDesignSettings
  onChange: (design: PayPalDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'payment', label: 'Payment', icon: '💳' },
]

export function PayPalDesigner({ design, onChange }: PayPalDesignerProps) {
  const { t } = useTranslation()
  const updateDesign = (updates: Partial<PayPalDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderPaymentContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Payment Page Settings')}</h4>

      {/* Card Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('Payment Card Style')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'standard', label: t('Standard') },
            { value: 'modern', label: t('Modern') },
            { value: 'minimal', label: t('Minimal') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  paymentCardStyle: option.value as PayPalDesignSettings['paymentCardStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.paymentCardStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* PayPal Button Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('PayPal Button Style')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'blue', label: t('Blue') },
            { value: 'gold', label: t('Gold') },
            { value: 'silver', label: t('Silver') },
            { value: 'white', label: t('White') },
            { value: 'black', label: t('Black') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  paypalButtonStyle: option.value as PayPalDesignSettings['paypalButtonStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.paypalButtonStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showItemDetails"
            checked={design.showItemDetails ?? true}
            onChange={e => updateDesign({ showItemDetails: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showItemDetails" className="text-sm text-gray-700">
            {t('Show Item Details')}
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmationRequired"
            checked={design.confirmationRequired ?? true}
            onChange={e => updateDesign({ confirmationRequired: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="confirmationRequired" className="text-sm text-gray-700">
            {t('Require Confirmation Before Redirect')}
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">{t('How PayPal QR Works')}</h5>
        <p className="text-sm text-blue-800">
          {t(
            'When scanned, the QR code displays a payment page with the configured amount and item details. Users are then redirected to PayPal to complete the payment securely.'
          )}
        </p>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderPaymentContent()}
    </BaseDesigner>
  )
}

export default PayPalDesigner

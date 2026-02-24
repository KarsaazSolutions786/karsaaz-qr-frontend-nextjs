'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

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

export function UPIDynamicDesigner({ design, onChange }: UPIDynamicDesignerProps) {
  const updateDesign = (updates: Partial<UPIDynamicDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderPaymentPageContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Payment Page Settings</h4>

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
            Show Logo
          </label>
        </div>

        {design.showLogo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Style</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'card', label: 'Card' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'bordered', label: 'Bordered' },
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
          <input
            type="text"
            value={design.pageTitle || ''}
            onChange={e => updateDesign({ pageTitle: e.target.value })}
            placeholder="Enter page title"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Text</label>
          <textarea
            value={design.pageText || ''}
            onChange={e => updateDesign({ pageText: e.target.value })}
            placeholder="Enter description or instructions"
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
      </div>

      {/* Pay Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">Pay Button</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={design.payButtonText || 'Pay Now'}
            onChange={e => updateDesign({ payButtonText: e.target.value })}
            placeholder="Pay Now"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Background Color
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text Color</label>
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
            Show Payment Method Icons
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
            Show Security Badge
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

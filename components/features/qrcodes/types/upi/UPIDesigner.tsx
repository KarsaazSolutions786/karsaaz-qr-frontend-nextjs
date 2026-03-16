'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { useTranslation } from '@/lib/i18n'

export interface UPIDesignSettings extends DesignSettings {
  // UPI (Static) is a direct payment link
  // Minimal design settings needed as it opens in a payment app
}

interface UPIDesignerProps {
  design: UPIDesignSettings
  onChange: (design: UPIDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
]

export function UPIDesigner({ design, onChange }: UPIDesignerProps) {
  const { t } = useTranslation()
  const renderInfoContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">{t('UPI Static QR Code')}</h4>
        <p className="text-sm text-blue-800">
          {t('This QR code will open directly in UPI payment apps (Google Pay, PhonePe, Paytm, etc.). The payer will enter the amount manually.')}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">{t('Usage Tips')}</h5>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>{t('Display prominently at point of sale')}</li>
          <li>{t('Print on invoices for easy payment')}</li>
          <li>{t('Include in email signatures for freelancers')}</li>
          <li>{t('Laminate for durability in physical stores')}</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-medium text-yellow-900 mb-2">{t('Note')}</h5>
        <p className="text-sm text-yellow-800">
          {t('For QR codes with pre-filled amounts, use the UPI Dynamic QR Code type instead.')}
        </p>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderInfoContent()}
    </BaseDesigner>
  )
}

export default UPIDesigner

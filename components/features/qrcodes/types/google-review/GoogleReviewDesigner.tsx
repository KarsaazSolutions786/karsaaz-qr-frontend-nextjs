'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'

export interface GoogleReviewDesignSettings extends DesignSettings {
  // Google Review is a direct link to Google reviews
  // Minimal design settings needed as it redirects to Google
}

interface GoogleReviewDesignerProps {
  design: GoogleReviewDesignSettings
  onChange: (design: GoogleReviewDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
]

export function GoogleReviewDesigner({ design, onChange }: GoogleReviewDesignerProps) {
  const renderInfoContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Google Review QR Code</h4>
        <p className="text-sm text-blue-800">
          This QR code will redirect users directly to your Google Business review page. The base
          design settings above will be applied to the loading page before redirect.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Tips for More Reviews</h5>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Place QR codes on receipts and invoices</li>
          <li>• Display on table tents or counter displays</li>
          <li>• Include in follow-up emails</li>
          <li>• Add to business cards</li>
        </ul>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderInfoContent()}
    </BaseDesigner>
  )
}

export default GoogleReviewDesigner

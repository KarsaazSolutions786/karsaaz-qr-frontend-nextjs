'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'

export interface ResumeDesignSettings extends DesignSettings {
  // Resume is typically a direct link to a PDF or document
  // Minimal design settings needed
}

interface ResumeDesignerProps {
  design: ResumeDesignSettings
  onChange: (design: ResumeDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
]

export function ResumeDesigner({ design, onChange }: ResumeDesignerProps) {
  const renderInfoContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Resume QR Code</h4>
        <p className="text-sm text-blue-800">
          This QR code will link directly to your resume document (PDF, DOCX, etc.). The base design
          settings above will be applied to the loading page.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Best Practices</h5>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Keep your resume file under 5MB for fast loading</li>
          <li>• Use PDF format for best compatibility</li>
          <li>• Test the QR code before printing on business cards</li>
          <li>
            • Consider using a link that allows you to update the resume without changing the QR
            code
          </li>
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

export default ResumeDesigner

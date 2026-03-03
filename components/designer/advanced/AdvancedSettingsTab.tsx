'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EyeShapeFields, CornerFields } from '../fields'
import type { QRDesign } from './types'

interface AdvancedSettingsTabProps {
  design: QRDesign
  onChange: (design: QRDesign) => void
}

export default function AdvancedSettingsTab({ design, onChange }: AdvancedSettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="error-correction">Error Correction Level</Label>
        <select
          id="error-correction"
          value={design.errorCorrectionLevel}
          onChange={e =>
            onChange({
              ...design,
              errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
            })
          }
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quiet-zone">Quiet Zone: {design.quietZone}px</Label>
        <Input
          id="quiet-zone"
          type="range"
          min="0"
          max="20"
          value={design.quietZone}
          onChange={e => onChange({ ...design, quietZone: parseInt(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rounded-corners"
            checked={design.roundedCorners}
            onChange={e => onChange({ ...design, roundedCorners: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="rounded-corners">Rounded Corners</Label>
        </div>
      </div>
      {design.roundedCorners && (
        <div className="space-y-2">
          <Label htmlFor="corner-radius">Corner Radius: {design.cornerRadius}px</Label>
          <Input
            id="corner-radius"
            type="range"
            min="0"
            max="20"
            value={design.cornerRadius}
            onChange={e => onChange({ ...design, cornerRadius: parseInt(e.target.value) })}
          />
        </div>
      )}

      <div className="border-t pt-4">
        <Label className="mb-3 block">Eye Shape</Label>
        <EyeShapeFields
          eyeSettings={{
            outerShape: 'square',
            innerShape: 'square',
            useCustomColor: false,
          }}
          onChange={() => {}}
        />
      </div>

      <div className="border-t pt-4">
        <Label className="mb-3 block">Corner Style</Label>
        <CornerFields
          cornerSettings={{
            style: design.roundedCorners ? 'rounded' : 'square',
            radius: design.cornerRadius,
            applyToAll: true,
          }}
          onChange={settings =>
            onChange({
              ...design,
              roundedCorners: settings.style !== 'square',
              cornerRadius: settings.radius,
            })
          }
        />
      </div>
    </div>
  )
}

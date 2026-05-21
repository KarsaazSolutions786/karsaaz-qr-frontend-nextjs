'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EyeShapeFields, CornerFields } from '../fields'
import type { QRDesign } from './types'
import { useTranslation } from '@/lib/i18n'

interface AdvancedSettingsTabProps {
  design: QRDesign
  onChange: (design: QRDesign) => void
}

/**
 * Purpose: Executes AdvancedSettingsTab functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function AdvancedSettingsTab({ design, onChange }: AdvancedSettingsTabProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="error-correction">{t('Error Correction Level')}</Label>
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
          <option value="L">{t('Low (7%)')}</option>
          <option value="M">{t('Medium (15%)')}</option>
          <option value="Q">{t('Quartile (25%)')}</option>
          <option value="H">{t('High (30%)')}</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="quiet-zone">{t('Quiet Zone:')} {design.quietZone}px</Label>
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
          <Label htmlFor="rounded-corners">{t('Rounded Corners')}</Label>
        </div>
      </div>
      {design.roundedCorners && (
        <div className="space-y-2">
          <Label htmlFor="corner-radius">{t('Corner Radius:')} {design.cornerRadius}px</Label>
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
        <Label className="mb-3 block">{t('Eye Shape')}</Label>
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
        <Label className="mb-3 block">{t('Corner Style')}</Label>
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

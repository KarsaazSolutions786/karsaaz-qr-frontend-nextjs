'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import GradientEditor from '../GradientEditor'
import { ColorFields } from '../fields'
import type { QRDesign } from './types'

interface ColorsTabProps {
  design: QRDesign
  onChange: (design: QRDesign) => void
}

export default function ColorsTab({ design, onChange }: ColorsTabProps) {
  return (
    <div className="space-y-4">
      <ColorFields
        foregroundColor={design.foregroundColor}
        backgroundColor={design.backgroundColor}
        onChange={(fg, bg) => onChange({ ...design, foregroundColor: fg, backgroundColor: bg })}
      />

      <div className="border-t pt-4">
        <Label className="mb-3 block">Gradient Settings</Label>
        <GradientEditor
          gradient={design.gradient}
          onChange={gradient => onChange({ ...design, gradient })}
        />
      </div>

      <div className="border-t pt-4 space-y-3">
        <Label className="mb-1 block">Fill Type</Label>
        <div className="flex gap-2">
          {(['solid', 'gradient', 'image'] as const).map(ft => (
            <button
              key={ft}
              type="button"
              onClick={() => onChange({ ...design, fillType: ft })}
              className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                (design.fillType ?? 'solid') === ft
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
        {design.fillType === 'image' && (
          <div className="space-y-2">
            <Label className="text-xs">Module Fill Image</Label>
            {design.foregroundImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={design.foregroundImage}
                alt="Fill preview"
                className="h-16 w-16 rounded border object-cover"
              />
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="block w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-purple-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const url = URL.createObjectURL(file)
                onChange({ ...design, foregroundImage: url })
              }}
            />
            <p className="text-xs text-gray-400">PNG or JPG. Used as a mask over QR modules.</p>
          </div>
        )}
      </div>
    </div>
  )
}

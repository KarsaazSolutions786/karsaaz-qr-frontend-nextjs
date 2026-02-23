'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type StrokeStyle = 'solid' | 'dashed' | 'dotted'

interface OutlineConfig {
  strokeWidth: number
  strokeStyle: StrokeStyle
  fillOpacity: number
}

interface OutlinedShapesFieldsProps {
  value: OutlineConfig
  onChange: (config: OutlineConfig) => void
}

const STROKE_STYLES: Array<{ type: StrokeStyle; name: string; dasharray: string }> = [
  { type: 'solid', name: 'Solid', dasharray: 'none' },
  { type: 'dashed', name: 'Dashed', dasharray: '4 2' },
  { type: 'dotted', name: 'Dotted', dasharray: '1 2' },
]

export default function OutlinedShapesFields({ value, onChange }: OutlinedShapesFieldsProps) {
  const handleStrokeWidthChange = (strokeWidth: number) => {
    onChange({ ...value, strokeWidth })
  }

  const handleStrokeStyleChange = (strokeStyle: StrokeStyle) => {
    onChange({ ...value, strokeStyle })
  }

  const handleFillOpacityChange = (fillOpacity: number) => {
    onChange({ ...value, fillOpacity })
  }

  return (
    <div className="space-y-6">
      {/* Stroke Width Slider */}
      <div className="space-y-3">
        <Label htmlFor="stroke-width">Stroke Width: {value.strokeWidth}px</Label>
        <Input
          id="stroke-width"
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={value.strokeWidth}
          onChange={e => handleStrokeWidthChange(parseFloat(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1px</span>
          <span>5px</span>
        </div>
      </div>

      {/* Stroke Style Selector */}
      <div>
        <Label className="mb-3 block">Stroke Style</Label>
        <div className="grid grid-cols-3 gap-3">
          {STROKE_STYLES.map(style => (
            <button
              key={style.type}
              onClick={() => handleStrokeStyleChange(style.type)}
              className={`rounded-lg border-2 p-3 transition-all ${
                value.strokeStyle === style.type
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center h-8 mb-2">
                <svg width="60" height="4" className="text-gray-800">
                  <line
                    x1="0"
                    y1="2"
                    x2="60"
                    y2="2"
                    stroke="currentColor"
                    strokeWidth={value.strokeWidth}
                    strokeDasharray={style.dasharray}
                  />
                </svg>
              </div>
              <div className="text-xs font-medium text-center">{style.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fill Opacity Control */}
      <div className="space-y-3">
        <Label htmlFor="fill-opacity">Fill Opacity: {Math.round(value.fillOpacity * 100)}%</Label>
        <Input
          id="fill-opacity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value.fillOpacity}
          onChange={e => handleFillOpacityChange(parseFloat(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Hollow</span>
          <span>Filled</span>
        </div>
      </div>

      {/* Outline Preview */}
      <div>
        <Label className="mb-3 block">Preview</Label>
        <Card className="p-6 bg-gray-50">
          <div className="flex items-center justify-center gap-4">
            {/* Square preview */}
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <rect
                  x="4"
                  y="4"
                  width="40"
                  height="40"
                  fill={`rgba(31, 41, 55, ${value.fillOpacity})`}
                  stroke="#1f2937"
                  strokeWidth={value.strokeWidth}
                  strokeDasharray={STROKE_STYLES.find(s => s.type === value.strokeStyle)?.dasharray}
                />
              </svg>
              <span className="text-xs text-muted-foreground">Square</span>
            </div>
            {/* Circle preview */}
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill={`rgba(31, 41, 55, ${value.fillOpacity})`}
                  stroke="#1f2937"
                  strokeWidth={value.strokeWidth}
                  strokeDasharray={STROKE_STYLES.find(s => s.type === value.strokeStyle)?.dasharray}
                />
              </svg>
              <span className="text-xs text-muted-foreground">Circle</span>
            </div>
            {/* Rounded preview */}
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <rect
                  x="4"
                  y="4"
                  width="40"
                  height="40"
                  rx="8"
                  fill={`rgba(31, 41, 55, ${value.fillOpacity})`}
                  stroke="#1f2937"
                  strokeWidth={value.strokeWidth}
                  strokeDasharray={STROKE_STYLES.find(s => s.type === value.strokeStyle)?.dasharray}
                />
              </svg>
              <span className="text-xs text-muted-foreground">Rounded</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Scanning Notice */}
      {value.fillOpacity < 0.3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <strong>⚠️ Scanning Notice:</strong> Very low fill opacity may reduce QR code
            scannability. Consider using at least 30% fill for reliable scanning.
          </p>
        </div>
      )}
    </div>
  )
}

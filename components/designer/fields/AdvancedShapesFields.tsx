'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

type ShapeType = 'custom-svg' | 'mixed' | 'geometric'
type ModulePattern = 'uniform' | 'alternating' | 'random' | 'gradient'

interface AdvancedShapeConfig {
  shapeType: ShapeType
  modulePattern: ModulePattern
  customSvg?: string
}

interface AdvancedShapesFieldsProps {
  value: AdvancedShapeConfig
  onChange: (config: AdvancedShapeConfig) => void
}

const SHAPE_TYPES: Array<{ type: ShapeType; name: string; description: string }> = [
  { type: 'custom-svg', name: 'Custom SVG', description: 'Upload your own SVG shape' },
  { type: 'mixed', name: 'Mixed', description: 'Combine multiple shape styles' },
  {
    type: 'geometric',
    name: 'Geometric',
    description: 'Geometric patterns like hexagons, diamonds',
  },
]

const MODULE_PATTERNS: Array<{ type: ModulePattern; name: string }> = [
  { type: 'uniform', name: 'Uniform' },
  { type: 'alternating', name: 'Alternating' },
  { type: 'random', name: 'Random' },
  { type: 'gradient', name: 'Gradient' },
]

export default function AdvancedShapesFields({ value, onChange }: AdvancedShapesFieldsProps) {
  const [previewShape, setPreviewShape] = useState<ShapeType>(value.shapeType)

  const handleShapeTypeChange = (shapeType: ShapeType) => {
    setPreviewShape(shapeType)
    onChange({ ...value, shapeType })
  }

  const handlePatternChange = (modulePattern: ModulePattern) => {
    onChange({ ...value, modulePattern })
  }

  const renderShapePreview = (type: ShapeType) => {
    switch (type) {
      case 'custom-svg':
        return (
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-800" fill="currentColor">
            <path
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case 'mixed':
        return (
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 rounded-none" />
            <div className="w-3 h-3 bg-gray-800 rounded-full" />
            <div className="w-3 h-3 bg-gray-800 rounded-md" />
          </div>
        )
      case 'geometric':
        return (
          <svg viewBox="0 0 40 40" className="w-10 h-10 text-gray-800" fill="currentColor">
            <polygon points="20,2 38,15 32,38 8,38 2,15" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Shape Type Selector */}
      <div>
        <Label className="mb-3 block">Shape Type</Label>
        <div className="grid grid-cols-3 gap-3">
          {SHAPE_TYPES.map(option => (
            <button
              key={option.type}
              onClick={() => handleShapeTypeChange(option.type)}
              className={`relative rounded-lg border-2 p-4 transition-all text-center ${
                previewShape === option.type
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center h-12 mb-2">
                {renderShapePreview(option.type)}
              </div>
              <div className="font-medium text-sm">{option.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Module Pattern Options */}
      <div>
        <Label className="mb-3 block">Module Pattern</Label>
        <div className="grid grid-cols-2 gap-3">
          {MODULE_PATTERNS.map(pattern => (
            <button
              key={pattern.type}
              onClick={() => handlePatternChange(pattern.type)}
              className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                value.modulePattern === pattern.type
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview of Selected Shape */}
      <div>
        <Label className="mb-3 block">Shape Preview</Label>
        <Card className="p-6 bg-gray-50">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-5 gap-1 p-4 bg-white rounded-lg shadow-sm">
              {Array.from({ length: 25 }).map((_, i) => {
                const isActive = [
                  0, 1, 2, 3, 4, 5, 6, 10, 11, 14, 15, 18, 20, 21, 22, 23, 24,
                ].includes(i)
                if (!isActive) return <div key={i} className="w-4 h-4" />

                switch (previewShape) {
                  case 'geometric':
                    return (
                      <svg key={i} viewBox="0 0 20 20" className="w-4 h-4">
                        <polygon points="10,1 19,7 16,18 4,18 1,7" fill="#1f2937" />
                      </svg>
                    )
                  case 'mixed':
                    return (
                      <div
                        key={i}
                        className={`w-4 h-4 bg-gray-800 ${
                          i % 3 === 0 ? 'rounded-none' : i % 3 === 1 ? 'rounded-full' : 'rounded-md'
                        }`}
                      />
                    )
                  default:
                    return <div key={i} className="w-4 h-4 bg-gray-800 rounded-sm" />
                }
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Preview with {SHAPE_TYPES.find(s => s.type === previewShape)?.name} shape
          </p>
        </Card>
      </div>

      {/* Custom SVG Upload */}
      {previewShape === 'custom-svg' && (
        <div className="space-y-2">
          <Label>Upload Custom SVG</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg
              className="w-10 h-10 mx-auto text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">Drop an SVG file or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Recommended: 24×24px viewBox</p>
            <input type="file" accept=".svg" className="hidden" id="advanced-shape-upload" />
            <label htmlFor="advanced-shape-upload">
              <span className="mt-3 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                Choose File
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import type { PatternSettings } from './types'
import { useTranslation } from '@/lib/i18n'

interface PatternGridProps {
  pattern: PatternSettings
  onSelectType: (type: PatternSettings['type']) => void
}

export default function PatternGrid({ pattern, onSelectType }: PatternGridProps) {
  const { t } = useTranslation()
  const patternOptions = [
    {
      type: 'none' as const,
      name: 'None',
      preview: <div className="w-full h-full bg-white border-2 border-dashed border-gray-300" />,
    },
    {
      type: 'dots' as const,
      name: 'Dots',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `radial-gradient(circle, ${pattern.color} 2px, transparent 2px)`,
            backgroundSize: '12px 12px',
          }}
        />
      ),
    },
    {
      type: 'squares' as const,
      name: 'Squares',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${pattern.color} 1px, transparent 1px),
              linear-gradient(180deg, ${pattern.color} 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        />
      ),
    },
    {
      type: 'hexagons' as const,
      name: 'Hexagons',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="hex-preview" width="20" height="17.32" patternUnits="userSpaceOnUse">
              <polygon
                points="10,0 20,5 20,12.32 10,17.32 0,12.32 0,5"
                fill="none"
                stroke={pattern.color}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#hex-preview)`} />
        </svg>
      ),
    },
    {
      type: 'diamonds' as const,
      name: 'Diamonds',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="diamond-preview" width="12" height="12" patternUnits="userSpaceOnUse">
              <polygon points="6,0 12,6 6,12 0,6" fill={pattern.color} opacity="0.4" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#diamond-preview)`} />
        </svg>
      ),
    },
    {
      type: 'stripes-h' as const,
      name: 'H-Stripes',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent 10px)`,
          }}
        />
      ),
    },
    {
      type: 'stripes-v' as const,
      name: 'V-Stripes',
      preview: (
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent 10px)`,
          }}
        />
      ),
    },
    {
      type: 'triangles' as const,
      name: 'Triangles',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="tri-preview" width="14" height="12" patternUnits="userSpaceOnUse">
              <polygon points="7,0 14,12 0,12" fill={pattern.color} opacity="0.35" />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#tri-preview)`} />
        </svg>
      ),
    },
    {
      type: 'waves' as const,
      name: 'Waves',
      preview: (
        <svg className="w-full h-full" viewBox="0 0 60 60">
          <defs>
            <pattern id="wave-preview" width="60" height="12" patternUnits="userSpaceOnUse">
              <path
                d="M0,6 Q15,0 30,6 Q45,12 60,6"
                fill="none"
                stroke={pattern.color}
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="white" />
          <rect width="60" height="60" fill={`url(#wave-preview)`} />
        </svg>
      ),
    },
    {
      type: 'custom' as const,
      name: 'Custom',
      preview: pattern.customImage ? (
        <div
          className="w-full h-full bg-white bg-cover bg-center"
          style={{ backgroundImage: `url(${pattern.customImage})` }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <Label className="mb-3 block">{t('Pattern Type')}</Label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {patternOptions.map(option => (
          <button
            key={option.type}
            onClick={() => onSelectType(option.type)}
            className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
              pattern.type === option.type
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {option.preview}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-1 text-xs font-medium text-center border-t">
              {option.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

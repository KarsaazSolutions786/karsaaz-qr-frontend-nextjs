'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { PatternSettings } from './types'

interface PatternPreviewRendererProps {
  pattern: PatternSettings
}

export default function PatternPreviewRenderer({ pattern }: PatternPreviewRendererProps) {
  if (pattern.type === 'none') return null

  const rotation = pattern.rotation ?? 0
  const scale = (pattern.scale ?? 100) / 100
  const transformStyle = {
    transform: `rotate(${rotation}deg) scale(${scale})`,
    transformOrigin: 'center center',
  }

  const renderPreview = () => {
    switch (pattern.type) {
      case 'dots':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${pattern.color} ${pattern.density / 25}px, transparent ${pattern.density / 25}px)`,
              backgroundSize: `${pattern.density / 4}px ${pattern.density / 4}px`,
              ...transformStyle,
            }}
          />
        )
      case 'squares':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, ${pattern.color} 1px, transparent 1px),
                linear-gradient(180deg, ${pattern.color} 1px, transparent 1px)
              `,
              backgroundSize: `${pattern.density / 5}px ${pattern.density / 5}px`,
              ...transformStyle,
            }}
          />
        )
      case 'hexagons':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="hex-full" width="20" height="17.32" patternUnits="userSpaceOnUse">
                <polygon
                  points="10,0 20,5 20,12.32 10,17.32 0,12.32 0,5"
                  fill="none"
                  stroke={pattern.color}
                  strokeWidth="0.5"
                  opacity={pattern.density / 100}
                />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#hex-full)`} />
          </svg>
        )
      case 'diamonds':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="diamond-full" width="12" height="12" patternUnits="userSpaceOnUse">
                <polygon
                  points="6,0 12,6 6,12 0,6"
                  fill={pattern.color}
                  opacity={pattern.density / 200}
                />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#diamond-full)`} />
          </svg>
        )
      case 'stripes-h':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent ${pattern.density / 5}px)`,
              ...transformStyle,
            }}
          />
        )
      case 'stripes-v':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${pattern.color} 0px, ${pattern.color} 2px, transparent 2px, transparent ${pattern.density / 5}px)`,
              ...transformStyle,
            }}
          />
        )
      case 'triangles':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="tri-full" width="14" height="12" patternUnits="userSpaceOnUse">
                <polygon
                  points="7,0 14,12 0,12"
                  fill={pattern.color}
                  opacity={pattern.density / 200}
                />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#tri-full)`} />
          </svg>
        )
      case 'waves':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 120" style={transformStyle}>
            <defs>
              <pattern id="wave-full" width="60" height="12" patternUnits="userSpaceOnUse">
                <path
                  d="M0,6 Q15,0 30,6 Q45,12 60,6"
                  fill="none"
                  stroke={pattern.color}
                  strokeWidth="1.5"
                  opacity={pattern.density / 100}
                />
              </pattern>
            </defs>
            <rect width="120" height="120" fill={`url(#wave-full)`} />
          </svg>
        )
      case 'custom':
        return pattern.customImage ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${pattern.customImage})`,
              opacity: pattern.density / 100,
              ...transformStyle,
            }}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <Label>Pattern Preview</Label>
      <Card className="p-0 overflow-hidden">
        <div className="h-32 bg-white relative">{renderPreview()}</div>
      </Card>
    </div>
  )
}

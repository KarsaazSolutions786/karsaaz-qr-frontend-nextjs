'use client'

import React, { useState } from 'react'
import { ThemeSettings } from '@/types/entities/biolinks'
import { useTranslation } from '@/lib/i18n'
import { gradientPresets } from './constants'

interface BackgroundTabProps {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
}

export default function BackgroundTab({ theme, updateTheme }: BackgroundTabProps) {
  const { t } = useTranslation()
  const [backgroundMode, setBackgroundMode] = useState<'color' | 'gradient' | 'image'>('color')

  const applyGradient = (colors: string[]) => {
    updateTheme({
      backgroundGradient: {
        type: 'linear',
        colors,
        angle: 135,
      },
    })
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBackgroundMode('color')}
          className={`px-3 py-1 rounded ${
            backgroundMode === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {t('biolinks.designer.solidColor')}
        </button>
        <button
          onClick={() => setBackgroundMode('gradient')}
          className={`px-3 py-1 rounded ${
            backgroundMode === 'gradient' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {t('biolinks.designer.gradient')}
        </button>
        <button
          onClick={() => setBackgroundMode('image')}
          className={`px-3 py-1 rounded ${
            backgroundMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {t('biolinks.designer.image')}
        </button>
      </div>

      {backgroundMode === 'color' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('biolinks.designer.backgroundColor')}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.backgroundColor || '#ffffff'}
              onChange={e => updateTheme({ backgroundColor: e.target.value })}
              className="h-10 w-20 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={theme.backgroundColor || '#ffffff'}
              onChange={e => updateTheme({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {backgroundMode === 'gradient' && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {gradientPresets.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyGradient(preset.colors)}
                className="h-16 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                }}
                title={preset.name}
              />
            ))}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('biolinks.designer.customGradient')}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={theme.backgroundGradient?.colors[0] || '#667eea'}
                onChange={e =>
                  updateTheme({
                    backgroundGradient: {
                      type: 'linear',
                      colors: [e.target.value, theme.backgroundGradient?.colors[1] || '#764ba2'],
                      angle: theme.backgroundGradient?.angle || 135,
                    },
                  })
                }
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="color"
                value={theme.backgroundGradient?.colors[1] || '#764ba2'}
                onChange={e =>
                  updateTheme({
                    backgroundGradient: {
                      type: 'linear',
                      colors: [theme.backgroundGradient?.colors[0] || '#667eea', e.target.value],
                      angle: theme.backgroundGradient?.angle || 135,
                    },
                  })
                }
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="number"
                value={theme.backgroundGradient?.angle || 135}
                onChange={e =>
                  updateTheme({
                    backgroundGradient: {
                      ...theme.backgroundGradient!,
                      angle: parseInt(e.target.value),
                    },
                  })
                }
                className="w-24 px-3 py-2 border rounded-lg"
                placeholder="Angle"
                min="0"
                max="360"
              />
            </div>
          </div>
        </>
      )}

      {backgroundMode === 'image' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('biolinks.designer.imageUrl')}
            </label>
            <input
              type="url"
              value={theme.backgroundImage || ''}
              onChange={e => updateTheme({ backgroundImage: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/background.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {`${t('biolinks.designer.blurAmount')} ${theme.backgroundBlur || 0}px`}
            </label>
            <input
              type="range"
              value={theme.backgroundBlur || 0}
              onChange={e => updateTheme({ backgroundBlur: parseInt(e.target.value) })}
              min="0"
              max="20"
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  )
}

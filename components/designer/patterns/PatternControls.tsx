'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import type { PatternSettings } from './types'
import { useTranslation } from '@/lib/i18n'

interface PatternControlsProps {
  pattern: PatternSettings
  onUpdate: (updates: Partial<PatternSettings>) => void
  onCustomImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PatternControls({
  pattern,
  onUpdate,
  onCustomImageUpload,
}: PatternControlsProps) {
  const { t } = useTranslation()
  if (pattern.type === 'none') {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">{t('No pattern selected')}</p>
        <p className="text-xs mt-1">{t('Choose a pattern type to get started')}</p>
      </div>
    )
  }

  return (
    <>
      {/* Pattern Color Picker */}
      {pattern.type !== 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="pattern-color">{t('Pattern Color')}</Label>
          <div className="flex gap-2">
            <Input
              id="pattern-color"
              type="color"
              value={pattern.color}
              onChange={e => onUpdate({ color: e.target.value })}
              className="h-10 w-20"
            />
            <Input
              type="text"
              value={pattern.color}
              onChange={e => onUpdate({ color: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Pattern Density Slider */}
      <div className="space-y-2">
        <Label htmlFor="pattern-density">
          {pattern.type === 'custom' ? t('Opacity') : t('Density')}: {pattern.density}%
        </Label>
        <Input
          id="pattern-density"
          type="range"
          min="10"
          max="100"
          value={pattern.density}
          onChange={e => onUpdate({ density: parseInt(e.target.value) })}
        />
      </div>

      {/* Rotation & Scale */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pattern-rotation">{t('Rotation:')} {pattern.rotation ?? 0}&deg;</Label>
          <Input
            id="pattern-rotation"
            type="range"
            min="0"
            max="360"
            value={pattern.rotation ?? 0}
            onChange={e => onUpdate({ rotation: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pattern-scale">{t('Scale:')} {pattern.scale ?? 100}%</Label>
          <Input
            id="pattern-scale"
            type="range"
            min="50"
            max="200"
            value={pattern.scale ?? 100}
            onChange={e => onUpdate({ scale: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Custom Pattern Upload */}
      {pattern.type === 'custom' && (
        <div className="space-y-2">
          <Label>{t('Upload Custom Pattern')}</Label>
          <div className="flex gap-2">
            <label htmlFor="custom-pattern-upload" className="flex-1">
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('Choose Image')}
                </span>
              </Button>
              <input
                id="custom-pattern-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCustomImageUpload}
              />
            </label>
            {pattern.customImage && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdate({ customImage: undefined })}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('Recommended: PNG with transparency, 256x256px')}
          </p>
        </div>
      )}
    </>
  )
}

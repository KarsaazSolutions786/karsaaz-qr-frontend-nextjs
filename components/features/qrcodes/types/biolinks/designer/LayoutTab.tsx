'use client'

import React from 'react'
import { ThemeSettings } from '@/types/entities/biolinks'
import { useTranslation } from '@/lib/i18n'

interface LayoutTabProps {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
}

/**
 * Purpose: Executes LayoutTab functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function LayoutTab({ theme, updateTheme }: LayoutTabProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {`${t('biolinks.designer.maxWidth')} ${theme.maxWidth || 680}px`}
        </label>
        <input
          type="range"
          value={theme.maxWidth || 680}
          onChange={e => updateTheme({ maxWidth: parseInt(e.target.value) })}
          min="320"
          max="1200"
          step="20"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {`${t('biolinks.designer.padding')} ${theme.padding || 24}px`}
        </label>
        <input
          type="range"
          value={theme.padding || 24}
          onChange={e => updateTheme({ padding: parseInt(e.target.value) })}
          min="0"
          max="48"
          step="4"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {`${t('biolinks.designer.blockSpacing')} ${theme.spacing || 16}px`}
        </label>
        <input
          type="range"
          value={theme.spacing || 16}
          onChange={e => updateTheme({ spacing: parseInt(e.target.value) })}
          min="0"
          max="48"
          step="4"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {`${t('biolinks.designer.borderRadius')} ${theme.borderRadius || 12}px`}
        </label>
        <input
          type="range"
          value={theme.borderRadius || 12}
          onChange={e => updateTheme({ borderRadius: parseInt(e.target.value) })}
          min="0"
          max="32"
          step="2"
          className="w-full"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableAnimations"
          checked={theme.enableAnimations ?? true}
          onChange={e => updateTheme({ enableAnimations: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="enableAnimations" className="text-sm text-gray-700">
          {t('biolinks.designer.enableAnimations')}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.customCss')}
        </label>
        <textarea
          value={theme.customCss || ''}
          onChange={e => updateTheme({ customCss: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          rows={6}
          placeholder="/* Add custom CSS here */"
        />
      </div>
    </>
  )
}

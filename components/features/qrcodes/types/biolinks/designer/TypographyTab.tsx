'use client'

import React from 'react'
import { ThemeSettings } from '@/types/entities/biolinks'
import { useTranslation } from '@/lib/i18n'
import { fontOptions } from './constants'

interface TypographyTabProps {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
}

/**
 * Purpose: Executes TypographyTab functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function TypographyTab({ theme, updateTheme }: TypographyTabProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.fontFamily')}
        </label>
        <select
          value={theme.fontFamily || fontOptions[0]?.value || 'Inter'}
          onChange={e => updateTheme({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {fontOptions.map(font => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.primaryColor')}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.primaryColor || '#3b82f6'}
            onChange={e => updateTheme({ primaryColor: e.target.value })}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={theme.primaryColor || '#3b82f6'}
            onChange={e => updateTheme({ primaryColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.textColor')}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.textColor || '#1f2937'}
            onChange={e => updateTheme({ textColor: e.target.value })}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={theme.textColor || '#1f2937'}
            onChange={e => updateTheme({ textColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </>
  )
}

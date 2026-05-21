'use client'

import React from 'react'
import { ThemeSettings } from '@/types/entities/biolinks'
import { useTranslation } from '@/lib/i18n'

interface ButtonsTabProps {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
}

/**
 * Purpose: Executes ButtonsTab functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function ButtonsTab({ theme, updateTheme }: ButtonsTabProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.buttonStyle')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['rounded', 'square', 'pill'].map(style => (
            <button
              key={style}
              onClick={() => updateTheme({ buttonStyle: style as 'rounded' | 'square' | 'pill' })}
              className={`px-4 py-2 border-2 capitalize ${
                theme.buttonStyle === style ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              } ${
                style === 'rounded'
                  ? 'rounded-lg'
                  : style === 'pill'
                    ? 'rounded-full'
                    : 'rounded-none'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.buttonColor')}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.buttonColor || '#3b82f6'}
            onChange={e => updateTheme({ buttonColor: e.target.value })}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={theme.buttonColor || '#3b82f6'}
            onChange={e => updateTheme({ buttonColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('biolinks.designer.buttonTextColor')}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.buttonTextColor || '#ffffff'}
            onChange={e => updateTheme({ buttonTextColor: e.target.value })}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={theme.buttonTextColor || '#ffffff'}
            onChange={e => updateTheme({ buttonTextColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="buttonShadow"
          checked={theme.buttonShadow ?? true}
          onChange={e => updateTheme({ buttonShadow: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="buttonShadow" className="text-sm text-gray-700">
          {t('biolinks.designer.enableButtonShadow')}
        </label>
      </div>
    </>
  )
}

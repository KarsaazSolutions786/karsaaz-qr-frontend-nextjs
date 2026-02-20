'use client'

import { useContext } from 'react'
import { TranslationContext, type TranslationContextValue } from './TranslationProvider'

/**
 * Hook to access translation functions and locale info.
 *
 * @example
 * const { t, locale, dir, isRtl, setLocale } = useTranslation()
 * return <h1>{t('Welcome')}</h1>
 */
export function useTranslation(): TranslationContextValue {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

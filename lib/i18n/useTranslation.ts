'use client'

import { useContext } from 'react'
import { TranslationContext, type TranslationContextValue } from './TranslationProvider'

/**
 * Purpose: Hook to access translation functions and locale info. const { t, locale, dir, isRtl, setLocale } = useTranslation() return <h1>{t('Welcome')}</h1>
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useTranslation(): TranslationContextValue {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getActiveTranslations,
  getTranslationStrings,
  switchLanguage as apiSwitchLanguage,
  type ActiveTranslation,
  type TranslationStrings,
} from '@/lib/api/endpoints/i18n'

const LOCALE_STORAGE_KEY = 'karsaaz_locale'
const DEFAULT_LOCALE = 'en'
const DEFAULT_DIR = 'ltr'

export interface TranslationContextValue {
  /** Translate a key. Returns the key itself if no translation found. */
  t: (key: string) => string
  /** Current locale code (e.g. 'en', 'ar', 'fr') */
  locale: string
  /** Text direction: 'ltr' or 'rtl' */
  dir: 'ltr' | 'rtl'
  /** Whether the current language is RTL */
  isRtl: boolean
  /** List of available languages */
  languages: ActiveTranslation[]
  /** Current active translation object */
  currentLanguage: ActiveTranslation | null
  /** Switch to a different locale */
  setLocale: (locale: string) => Promise<void>
  /** Whether translations are still loading */
  isLoading: boolean
}

export const TranslationContext = createContext<TranslationContextValue>({
  t: (key) => key,
  locale: DEFAULT_LOCALE,
  dir: DEFAULT_DIR,
  isRtl: false,
  languages: [],
  currentLanguage: null,
  setLocale: async () => {},
  isLoading: true,
})

function getSavedLocale(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return localStorage.getItem(LOCALE_STORAGE_KEY) || DEFAULT_LOCALE
}

function saveLocale(locale: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)
  const [dir, setDir] = useState<'ltr' | 'rtl'>(DEFAULT_DIR)
  const [strings, setStrings] = useState<TranslationStrings>({})
  const [languages, setLanguages] = useState<ActiveTranslation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load saved locale on mount
  useEffect(() => {
    setLocaleState(getSavedLocale())
  }, [])

  // Load active languages
  useEffect(() => {
    getActiveTranslations()
      .then(setLanguages)
      .catch(() => setLanguages([]))
  }, [])

  // Load translation strings whenever locale changes
  useEffect(() => {
    if (locale === DEFAULT_LOCALE) {
      // English is the default — keys are the English strings
      setStrings({})
      setDir(DEFAULT_DIR)
      setIsLoading(false)
      updateDocumentDir(DEFAULT_DIR, DEFAULT_LOCALE)
      return
    }

    setIsLoading(true)
    getTranslationStrings(locale)
      .then((data) => {
        setStrings(data)
        // Find direction from languages list
        const lang = languages.find((l) => l.locale === locale)
        const newDir = lang?.direction || DEFAULT_DIR
        setDir(newDir)
        updateDocumentDir(newDir, locale)
      })
      .catch(() => {
        setStrings({})
        setDir(DEFAULT_DIR)
        updateDocumentDir(DEFAULT_DIR, locale)
      })
      .finally(() => setIsLoading(false))
  }, [locale, languages])

  const t = useCallback(
    (key: string): string => {
      if (!key) return ''
      return strings[key] || key
    },
    [strings]
  )

  const setLocale = useCallback(
    async (newLocale: string) => {
      saveLocale(newLocale)
      setLocaleState(newLocale)
      try {
        await apiSwitchLanguage(newLocale)
      } catch {
        // Backend switch failed — local state still updated
      }
    },
    []
  )

  const currentLanguage = useMemo(
    () => languages.find((l) => l.locale === locale) || null,
    [languages, locale]
  )

  const value = useMemo<TranslationContextValue>(
    () => ({
      t,
      locale,
      dir,
      isRtl: dir === 'rtl',
      languages,
      currentLanguage,
      setLocale,
      isLoading,
    }),
    [t, locale, dir, languages, currentLanguage, setLocale, isLoading]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/** Update <html> element dir and lang attributes */
function updateDocumentDir(dir: 'ltr' | 'rtl', locale: string) {
  if (typeof document === 'undefined') return
  document.documentElement.dir = dir
  document.documentElement.lang = locale
}

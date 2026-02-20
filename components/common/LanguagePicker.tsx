'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

interface LanguagePickerProps {
  /** Use 'dark' for sidebar placement on dark backgrounds */
  variant?: 'light' | 'dark'
}

export function LanguagePicker({ variant = 'light' }: LanguagePickerProps) {
  const { languages, currentLanguage, locale, setLocale, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Don't render if only one language
  if (languages.length < 2) return null

  const isDark = variant === 'dark'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isDark
            ? 'text-white/80 hover:bg-white/10'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title={t('Switch language')}
      >
        {currentLanguage?.flag_url ? (
          <img
            src={currentLanguage.flag_url}
            alt={currentLanguage.display_name || currentLanguage.name}
            className="w-5 h-4 rounded-sm object-cover"
          />
        ) : (
          <GlobeAltIcon className="w-5 h-5" />
        )}
        <span className="hidden sm:inline">
          {currentLanguage?.display_name || currentLanguage?.name || locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className={`absolute mt-1 w-48 rounded-lg border shadow-lg z-50 py-1 ${
          isDark
            ? 'bg-purple-900 border-white/20 bottom-full mb-1'
            : 'bg-white border-gray-200 right-0 rtl:right-auto rtl:left-0'
        }`}>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLocale(lang.locale)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                lang.locale === locale
                  ? isDark
                    ? 'bg-white/20 text-white font-semibold'
                    : 'bg-purple-50 text-purple-700 font-semibold'
                  : isDark
                    ? 'text-white/80 hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {lang.flag_url ? (
                <img
                  src={lang.flag_url}
                  alt={lang.display_name || lang.name}
                  className="w-5 h-4 rounded-sm object-cover"
                />
              ) : (
                <GlobeAltIcon className="w-5 h-4 text-gray-400" />
              )}
              <span>{lang.display_name || lang.name}</span>
              {lang.is_default && (
                <span className={`ml-auto text-xs ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
                  (default)
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

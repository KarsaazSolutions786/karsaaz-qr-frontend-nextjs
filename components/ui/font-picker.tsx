'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { ChevronDown, ExternalLink, Search } from 'lucide-react'

export interface FontDefinition {
  name: string
  family: string
  variants?: string[]
  category?: string
}

const BUILT_IN_FONTS: FontDefinition[] = [
  { name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif' },
  { name: 'Helvetica', family: 'Helvetica, sans-serif', category: 'sans-serif' },
  { name: 'Times New Roman', family: '"Times New Roman", serif', category: 'serif' },
  { name: 'Georgia', family: 'Georgia, serif', category: 'serif' },
  { name: 'Courier New', family: '"Courier New", monospace', category: 'monospace' },
  { name: 'Verdana', family: 'Verdana, sans-serif', category: 'sans-serif' },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', category: 'sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif', category: 'sans-serif', variants: ['regular', '100', '300', '500', '700', '900'] },
  { name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'sans-serif', variants: ['regular', '300', '600', '700', '800'] },
  { name: 'Lato', family: 'Lato, sans-serif', category: 'sans-serif', variants: ['regular', '100', '300', '700', '900'] },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'sans-serif', variants: ['regular', '100', '200', '300', '500', '600', '700', '800', '900'] },
  { name: 'Poppins', family: 'Poppins, sans-serif', category: 'sans-serif', variants: ['regular', '100', '200', '300', '500', '600', '700', '800', '900'] },
  { name: 'Inter', family: 'Inter, sans-serif', category: 'sans-serif', variants: ['regular', '100', '200', '300', '500', '600', '700', '800', '900'] },
  { name: 'Raleway', family: 'Raleway, sans-serif', category: 'sans-serif', variants: ['regular', '100', '200', '300', '500', '600', '700', '800', '900'] },
  { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'serif', variants: ['regular', '500', '600', '700', '800', '900'] },
  { name: 'Oswald', family: 'Oswald, sans-serif', category: 'sans-serif', variants: ['regular', '200', '300', '500', '600', '700'] },
  { name: 'Nunito', family: 'Nunito, sans-serif', category: 'sans-serif', variants: ['regular', '200', '300', '600', '700', '800', '900'] },
  { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif', category: 'sans-serif', variants: ['regular', '200', '300', '600', '700', '900'] },
  { name: 'Merriweather', family: 'Merriweather, serif', category: 'serif', variants: ['regular', '300', '700', '900'] },
  { name: 'Ubuntu', family: 'Ubuntu, sans-serif', category: 'sans-serif', variants: ['regular', '300', '500', '700'] },
  { name: 'Inconsolata', family: 'Inconsolata, monospace', category: 'monospace', variants: ['regular', '200', '300', '500', '600', '700', '800', '900'] },
  { name: 'Dancing Script', family: '"Dancing Script", cursive', category: 'handwriting', variants: ['regular', '500', '600', '700'] },
  { name: 'Pacifico', family: 'Pacifico, cursive', category: 'handwriting' },
  { name: 'Caveat', family: 'Caveat, cursive', category: 'handwriting', variants: ['regular', '500', '600', '700'] },
]

const loadedFonts = new Set<string>()

function loadGoogleFont(fontName: string, variant?: string): void {
  if (typeof window === 'undefined') return
  const key = `${fontName}:${variant || 'regular'}`
  if (loadedFonts.has(key)) return
  loadedFonts.add(key)

  const encodedName = fontName.replace(/ /g, '+')
  const weightSuffix = variant && variant !== 'regular' ? `:wght@${variant}` : ''
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodedName}${weightSuffix}&display=swap`
  document.head.appendChild(link)
}

function getVariantLabel(variant: string): string {
  if (variant === 'regular') return 'Regular (400)'
  const weight = variant.replace(/italic/i, '').trim()
  const isItalic = variant.toLowerCase().includes('italic')
  const labels: Record<string, string> = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black',
  }
  const label = labels[weight] || weight
  return isItalic ? `${label} Italic` : `${label} (${weight})`
}

export interface FontPickerProps {
  value?: string
  onChange: (value: string) => void
  variant?: string
  onVariantChange?: (variant: string) => void
  fonts?: FontDefinition[]
  previewText?: string
  showVariants?: boolean
  className?: string
}

export function FontPicker({
  value,
  onChange,
  variant,
  onVariantChange,
  fonts,
  previewText = 'The quick brown fox',
  showVariants = true,
  className,
}: FontPickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const fontList = fonts || BUILT_IN_FONTS

  const filteredFonts = React.useMemo(() => {
    if (!search.trim()) return fontList
    const lower = search.toLowerCase()
    return fontList.filter((f) => f.name.toLowerCase().includes(lower))
  }, [fontList, search])

  const selectedFont = React.useMemo(
    () => fontList.find((f) => f.name === value),
    [fontList, value]
  )

  // Load selected font
  React.useEffect(() => {
    if (selectedFont) {
      loadGoogleFont(selectedFont.name, variant)
    }
  }, [selectedFont, variant])

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-focus search
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  // Validate variant when font changes
  React.useEffect(() => {
    if (!selectedFont?.variants || !onVariantChange || !variant) return
    if (!selectedFont.variants.includes(variant)) {
      onVariantChange(selectedFont.variants[0] || 'regular')
    }
  }, [selectedFont, variant, onVariantChange])

  const handleSelect = (font: FontDefinition) => {
    loadGoogleFont(font.name)
    onChange(font.name)
    setOpen(false)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Font selector dropdown */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        >
          <span
            className="truncate"
            style={{ fontFamily: selectedFont?.family }}
          >
            {selectedFont?.name || t('Select font...')}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
            {/* Search */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('Search fonts...')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'flex h-9 w-full rounded-md border border-gray-300 bg-white pl-8 pr-3 py-1 text-sm',
                    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  )}
                />
              </div>
            </div>

            {/* Font list */}
            <div className="max-h-64 overflow-auto">
              {filteredFonts.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {t('No fonts found')}
                </div>
              )}
              {filteredFonts.map((f) => {
                // Lazy-load Google font for preview when it scrolls into view
                return (
                  <FontListItem
                    key={f.name}
                    font={f}
                    selected={value === f.name}
                    previewText={previewText}
                    onClick={() => handleSelect(f)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Variant selector */}
      {showVariants && selectedFont?.variants && selectedFont.variants.length > 1 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">{t('Font variant')}</label>
          <div className="flex flex-wrap gap-1.5">
            {selectedFont.variants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onVariantChange?.(v)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  variant === v
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                )}
              >
                {getVariantLabel(v)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-500 leading-relaxed">
        {t('All Google fonts are supported. Preview and search fonts at')}{' '}
        <a
          href="https://fonts.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-500 hover:underline"
        >
          fonts.google.com
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

/** Individual font list item that loads the font when visible */
function FontListItem({
  font,
  selected,
  previewText,
  onClick,
}: {
  font: FontDefinition
  selected: boolean
  previewText: string
  onClick: () => void
}) {
  const itemRef = React.useRef<HTMLButtonElement>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    const el = itemRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !loaded) {
          loadGoogleFont(font.name)
          setLoaded(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [font.name, loaded])

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col items-start gap-0.5 px-3 py-2 text-sm hover:bg-blue-50 transition-colors',
        selected && 'bg-blue-50 text-blue-600'
      )}
    >
      <span className="font-medium">{font.name}</span>
      <span
        className="text-xs text-gray-400 truncate w-full"
        style={{ fontFamily: loaded ? font.family : undefined }}
      >
        {previewText}
      </span>
    </button>
  )
}

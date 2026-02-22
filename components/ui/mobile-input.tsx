'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
]

export interface MobileInputProps {
  className?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MobileInput = React.forwardRef<HTMLDivElement, MobileInputProps>(
  ({ className, value, onChange, placeholder = 'Phone number', disabled = false }, ref) => {
    const [countryCode, setCountryCode] = React.useState('+1')
    const [phone, setPhone] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (value) {
        const match = COUNTRY_CODES.find((c) => value.startsWith(c.code))
        if (match) {
          setCountryCode(match.code)
          setPhone(value.slice(match.code.length).trim())
        } else {
          setPhone(value)
        }
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const formatPhone = (raw: string) => raw.replace(/[^0-9]/g, '')

    const handlePhoneChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        setPhone(formatted)
        onChange?.(`${countryCode}${formatted}`)
      },
      [countryCode, onChange]
    )

    const handleCountrySelect = React.useCallback(
      (code: string) => {
        setCountryCode(code)
        setOpen(false)
        onChange?.(`${code}${phone}`)
      },
      [phone, onChange]
    )

    const selected = COUNTRY_CODES.find((c) => c.code === countryCode)

    return (
      <div ref={ref} className={cn('relative', className)}>
        <div
          ref={containerRef}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white text-sm shadow-sm transition-colors',
            'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <button
            type="button"
            className="flex items-center gap-1 border-r border-gray-300 px-2 text-sm hover:bg-gray-50"
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
          >
            <span>{selected?.flag}</span>
            <span className="text-gray-600">{countryCode}</span>
            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <input
            type="tel"
            className="w-full bg-transparent px-3 outline-none placeholder:text-gray-400"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        {open && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-md">
            {COUNTRY_CODES.map((c) => (
              <div
                key={c.code}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50',
                  c.code === countryCode && 'bg-blue-50 text-blue-700'
                )}
                onClick={() => handleCountrySelect(c.code)}
              >
                <span>{c.flag}</span>
                <span className="text-gray-600">{c.country}</span>
                <span className="text-gray-400">{c.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
MobileInput.displayName = 'MobileInput'

export { MobileInput }

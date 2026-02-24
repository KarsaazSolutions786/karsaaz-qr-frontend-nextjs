'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Direction = 'ltr' | 'rtl'

interface DirectionContextValue {
  direction: Direction
  isRTL: boolean
  setDirection: (dir: Direction) => void
  toggleDirection: () => void
}

const DirectionContext = createContext<DirectionContextValue | null>(null)

// Storage key for persisting direction preference
const DIRECTION_STORAGE_KEY = 'app-direction'

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi']

interface DirectionProviderProps {
  children: React.ReactNode
  defaultDirection?: Direction
  detectFromLanguage?: boolean
  persistPreference?: boolean
}

export function DirectionProvider({
  children,
  defaultDirection = 'ltr',
  detectFromLanguage = true,
  persistPreference = true,
}: DirectionProviderProps) {
  const [direction, setDirectionState] = useState<Direction>(() => {
    // Initialize direction from storage or language detection (SSR-safe)
    if (typeof window === 'undefined') return defaultDirection
    let initial: Direction = defaultDirection
    if (persistPreference) {
      const stored = localStorage.getItem(DIRECTION_STORAGE_KEY)
      if (stored === 'ltr' || stored === 'rtl') initial = stored
    }
    if (!localStorage.getItem(DIRECTION_STORAGE_KEY) && detectFromLanguage) {
      const lang = document.documentElement.lang || navigator.language
      const langCode = (lang.split('-')[0] ?? '').toLowerCase()
      if (RTL_LANGUAGES.includes(langCode)) initial = 'rtl'
    }
    return initial
  })
  const [isInitialized] = useState(() => typeof window !== 'undefined')

  // Apply direction to document
  useEffect(() => {
    if (!isInitialized) return

    document.documentElement.dir = direction
    document.documentElement.setAttribute('data-direction', direction)

    // Also set on body for compatibility
    document.body.dir = direction

    // Persist preference
    if (persistPreference && typeof window !== 'undefined') {
      localStorage.setItem(DIRECTION_STORAGE_KEY, direction)
    }
  }, [direction, isInitialized, persistPreference])

  const setDirection = useCallback((dir: Direction) => {
    setDirectionState(dir)
  }, [])

  const toggleDirection = useCallback(() => {
    setDirectionState(prev => (prev === 'ltr' ? 'rtl' : 'ltr'))
  }, [])

  const value: DirectionContextValue = {
    direction,
    isRTL: direction === 'rtl',
    setDirection,
    toggleDirection,
  }

  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>
}

export function useDirection(): DirectionContextValue {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}

// Hook that returns direction-aware values
export function useDirectionValue<T>(ltrValue: T, rtlValue: T): T {
  const { isRTL } = useDirection()
  return isRTL ? rtlValue : ltrValue
}

// Utility function for direction-aware class names
export function directionClass(direction: Direction, ltrClass: string, rtlClass: string): string {
  return direction === 'rtl' ? rtlClass : ltrClass
}

// Hook for direction-aware styles
export function useDirectionStyles() {
  const { direction, isRTL } = useDirection()

  return {
    direction,
    isRTL,
    // Text alignment
    textStart: isRTL ? 'text-right' : 'text-left',
    textEnd: isRTL ? 'text-left' : 'text-right',
    // Flex direction
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    // Margins and padding
    marginStart: (size: string) => (isRTL ? `mr-${size}` : `ml-${size}`),
    marginEnd: (size: string) => (isRTL ? `ml-${size}` : `mr-${size}`),
    paddingStart: (size: string) => (isRTL ? `pr-${size}` : `pl-${size}`),
    paddingEnd: (size: string) => (isRTL ? `pl-${size}` : `pr-${size}`),
    // Positioning
    start: isRTL ? 'right' : 'left',
    end: isRTL ? 'left' : 'right',
    // Border radius
    roundedStart: (size: string) => (isRTL ? `rounded-r-${size}` : `rounded-l-${size}`),
    roundedEnd: (size: string) => (isRTL ? `rounded-l-${size}` : `rounded-r-${size}`),
    // Transform
    flipX: isRTL ? 'scale-x-[-1]' : '',
  }
}

// CSS custom properties for direction
export function getDirectionCSSVars(direction: Direction) {
  const isRTL = direction === 'rtl'
  return {
    '--direction': direction,
    '--start': isRTL ? 'right' : 'left',
    '--end': isRTL ? 'left' : 'right',
    '--text-align': isRTL ? 'right' : 'left',
    '--flex-direction': isRTL ? 'row-reverse' : 'row',
  } as React.CSSProperties
}

export default DirectionProvider

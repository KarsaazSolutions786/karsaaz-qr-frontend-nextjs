/**
 * Responsive Utilities
 *
 * Utilities and hooks for responsive design.
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * Breakpoints (Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Purpose: useMediaQuery Hook Detects if a media query matches.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    /**
     * Purpose: Executes handler functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Purpose: useBreakpoint Hook Returns current breakpoint.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm')

  useEffect(() => {
    /**
     * Purpose: Updates the configuration or state.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl')
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl')
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg')
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md')
      } else {
        setBreakpoint('sm')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)

    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Purpose: useIsMobile Hook Detects if viewport is mobile size.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`)
}

/**
 * Purpose: useIsTablet Hook Detects if viewport is tablet size.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useIsTablet(): boolean {
  const isMdUp = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`)
  const isLgDown = useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`)
  return isMdUp && isLgDown
}

/**
 * Purpose: useIsDesktop Hook Detects if viewport is desktop size.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
}

/**
 * Purpose: useWindowSize Hook Returns current window dimensions.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    /**
     * Purpose: Executes handleResize functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

/**
 * Purpose: useOrientation Hook Detects device orientation.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    /**
     * Purpose: Updates the configuration or state.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)

    return () => window.removeEventListener('resize', updateOrientation)
  }, [])

  return orientation
}

/**
 * Purpose: ResponsiveContainer Component Renders different content based on breakpoint.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function ResponsiveContainer({
  mobile,
  tablet,
  desktop,
}: {
  mobile?: React.ReactNode
  tablet?: React.ReactNode
  desktop?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  if (isMobile && mobile) return <>{mobile}</>
  if (isTablet && tablet) return <>{tablet}</>
  if (desktop) return <>{desktop}</>

  return null
}

/**
 * Purpose: Container Component Responsive container with max-width.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function Container({
  children,
  className = '',
  maxWidth = 'xl',
}: {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Purpose: Grid Component Responsive grid with configurable columns.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function Grid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = '',
}: {
  children: React.ReactNode
  cols?: { sm?: number; md?: number; lg?: number; xl?: number }
  gap?: number
  className?: string
}) {
  const gridClasses = [
    `grid`,
    `gap-${gap}`,
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={gridClasses}>{children}</div>
}

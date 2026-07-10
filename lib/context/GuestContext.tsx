'use client'

import React, { createContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  guestAPI,
  type GuestSession,
  type GuestConfiguration,
  type GuestSessionInfo,
} from '@/lib/api/endpoints/guest'

export interface GuestContextType {
  /** Whether user is operating as a guest */
  isGuest: boolean
  /** Current guest session data */
  guestSession: GuestSession | null
  /** Guest feature configuration */
  guestConfig: GuestConfiguration | null
  /** Current session usage limits */
  sessionLimits: GuestSessionInfo['limits'] | null
  /** True while guest session is being initialized */
  isGuestLoading: boolean
  /** Set when guest session could not be created (e.g. rate limited) */
  guestInitError: string | null
  /** Number of QR codes created in this guest session (for signup prompt) */
  guestActionCount: number
  /** Whether to show the signup prompt */
  shouldShowSignupPrompt: boolean
  /** Increment action count (call after QR creation) */
  incrementActionCount: () => void
  /** End the guest session and clear local storage */
  endGuestSession: () => Promise<void>
  /** Returns the guest session token string (for passing to login/register) */
  getGuestToken: () => string | null
  /** Refresh session info from backend */
  refreshSession: () => Promise<void>
}

export const GuestContext = createContext<GuestContextType | undefined>(undefined)

const GUEST_INIT_ROUTE_PREFIXES = ['/guest', '/qrcodes/new']

function isGuestRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return GUEST_INIT_ROUTE_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

type GuestInitResult = {
  session: GuestSession | null
  limits: GuestSessionInfo['limits'] | null
  config: GuestConfiguration | null
  error: string | null
}

let guestInitPromise: Promise<GuestInitResult> | null = null

export function resetGuestInitStateForTests(): void {
  guestInitPromise = null
}

async function initializeGuestSession(): Promise<GuestInitResult> {
  if (guestInitPromise) return guestInitPromise

  guestInitPromise = (async (): Promise<GuestInitResult> => {
    const existingToken =
      typeof window !== 'undefined' ? localStorage.getItem('guest_session_token') : null

    if (existingToken) {
      try {
        const info = await guestAPI.getSession()
        return {
          session: info.session,
          limits: info.limits,
          config: info.configuration,
          error: null,
        }
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guest_session_token')
          localStorage.removeItem('guest_action_count')
        }
        if (status === 429) {
          return {
            session: null,
            limits: null,
            config: null,
            error: 'Too many requests. Please wait a moment and refresh the page.',
          }
        }
      }
    }

    try {
      const config = (await guestAPI.getConfiguration()) as GuestConfiguration
      if (!config.is_guest_mode_enabled) {
        return { session: null, limits: null, config, error: null }
      }

      const info = (await guestAPI.createSession('web')) as GuestSessionInfo
      if (typeof window !== 'undefined' && info.session?.session_token) {
        localStorage.setItem('guest_session_token', info.session.session_token)
      }

      return {
        session: info.session,
        limits: info.limits,
        config: info.configuration ?? config,
        error: null,
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 429) {
        return {
          session: null,
          limits: null,
          config: null,
          error: 'Too many requests. Please wait a moment and refresh the page.',
        }
      }
      return { session: null, limits: null, config: null, error: null }
    }
  })()

  return guestInitPromise
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const pathname = usePathname()

  const [guestSession, setGuestSession] = useState<GuestSession | null>(null)
  const [guestConfig, setGuestConfig] = useState<GuestConfiguration | null>(null)
  const [sessionLimits, setSessionLimits] = useState<GuestSessionInfo['limits'] | null>(null)
  const [isGuestLoading, setIsGuestLoading] = useState(true)
  const [guestInitError, setGuestInitError] = useState<string | null>(null)
  const [guestActionCount, setGuestActionCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('guest_action_count') || '0', 10)
    }
    return 0
  })

  const isGuest = !user && !!guestSession

  const shouldShowSignupPrompt = useMemo(() => {
    if (!guestConfig || !isGuest) return false
    return guestActionCount >= guestConfig.show_signup_prompt_after
  }, [guestConfig, isGuest, guestActionCount])

  const incrementActionCount = useCallback(() => {
    setGuestActionCount(prev => {
      const next = prev + 1
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_action_count', String(next))
      }
      return next
    })
  }, [])

  const getGuestToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('guest_session_token')
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const info = await guestAPI.getSession()
      setGuestSession(info.session)
      setSessionLimits(info.limits)
      setGuestConfig(info.configuration)
      setGuestInitError(null)
    } catch {
      // Session may have expired
    }
  }, [])

  const endGuestSession = useCallback(async () => {
    try {
      await guestAPI.endSession()
    } catch {
      // Ignore — session may already be gone
    }
    guestInitPromise = null
    setGuestSession(null)
    setSessionLimits(null)
    setGuestInitError(null)
    setGuestActionCount(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_session_token')
      localStorage.removeItem('guest_action_count')
    }
  }, [])

  useEffect(() => {
    if (isAuthLoading) return

    let cancelled = false

    if (user) {
      queueMicrotask(() => {
        if (!cancelled) setIsGuestLoading(false)
      })
      return () => {
        cancelled = true
      }
    }

    const existingToken =
      typeof window !== 'undefined' ? localStorage.getItem('guest_session_token') : null
    const shouldInit = Boolean(existingToken) || isGuestRoute(pathname)

    if (!shouldInit) {
      queueMicrotask(() => {
        if (!cancelled) setIsGuestLoading(false)
      })
      return () => {
        cancelled = true
      }
    }
    queueMicrotask(() => {
      if (!cancelled) setIsGuestLoading(true)
    })

    initializeGuestSession()
      .then(result => {
        if (cancelled) return
        setGuestSession(result.session)
        setSessionLimits(result.limits)
        setGuestConfig(result.config)
        setGuestInitError(result.error)
      })
      .finally(() => {
        if (!cancelled) setIsGuestLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, isAuthLoading, pathname])

  const contextValue = useMemo<GuestContextType>(
    () => ({
      isGuest,
      guestSession,
      guestConfig,
      sessionLimits,
      isGuestLoading,
      guestInitError,
      guestActionCount,
      shouldShowSignupPrompt,
      incrementActionCount,
      endGuestSession,
      getGuestToken,
      refreshSession,
    }),
    [
      isGuest,
      guestSession,
      guestConfig,
      sessionLimits,
      isGuestLoading,
      guestInitError,
      guestActionCount,
      shouldShowSignupPrompt,
      incrementActionCount,
      endGuestSession,
      getGuestToken,
      refreshSession,
    ]
  )

  return <GuestContext.Provider value={contextValue}>{children}</GuestContext.Provider>
}

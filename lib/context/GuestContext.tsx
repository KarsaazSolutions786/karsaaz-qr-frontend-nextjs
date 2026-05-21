'use client'

import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react'
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

/**
 * Purpose: Executes GuestProvider functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function GuestProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const initRef = useRef(false)

  const [guestSession, setGuestSession] = useState<GuestSession | null>(null)
  const [guestConfig, setGuestConfig] = useState<GuestConfiguration | null>(null)
  const [sessionLimits, setSessionLimits] = useState<GuestSessionInfo['limits'] | null>(null)
  const [isGuestLoading, setIsGuestLoading] = useState(true)
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
    setGuestSession(null)
    setSessionLimits(null)
    setGuestActionCount(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_session_token')
      localStorage.removeItem('guest_action_count')
    }
  }, [])

  // Initialize guest session if user is not logged in
  useEffect(() => {
    if (isAuthLoading || initRef.current) return
    initRef.current = true

    // If a user is logged in, guest mode is not needed
    if (user) {
      setIsGuestLoading(false)
      return
    }

    /**
     * Purpose: Initializes the service or component.
     * Owner/Author: Syed Ashhad
     * Created/Updated: March 2026
     */
    const initGuest = async () => {
      try {
        // Check if there's an existing guest token
        const existingToken = typeof window !== 'undefined'
          ? localStorage.getItem('guest_session_token')
          : null

        if (existingToken) {
          // Validate existing session
          try {
            const info = await guestAPI.getSession()
            setGuestSession(info.session)
            setSessionLimits(info.limits)
            setGuestConfig(info.configuration)
            setIsGuestLoading(false)
            return
          } catch {
            // Token is invalid or expired — clear and try to create new
            localStorage.removeItem('guest_session_token')
            localStorage.removeItem('guest_action_count')
          }
        }

        // Check if guest mode is enabled
        const config = await guestAPI.getConfiguration() as GuestConfiguration
        setGuestConfig(config)

        if (!config.is_guest_mode_enabled) {
          setIsGuestLoading(false)
          return
        }

        // Auto-create a guest session
        const info = await guestAPI.createSession('web') as GuestSessionInfo
        if (typeof window !== 'undefined' && info.session?.session_token) {
          localStorage.setItem('guest_session_token', info.session.session_token)
        }
        setGuestSession(info.session)
        setSessionLimits(info.limits)
        if (info.configuration) {
          setGuestConfig(info.configuration)
        }
      } catch {
        // Guest mode is not available — that's fine, user can still sign up
      } finally {
        setIsGuestLoading(false)
      }
    }

    initGuest()
  }, [user, isAuthLoading])

  const contextValue = useMemo<GuestContextType>(
    () => ({
      isGuest,
      guestSession,
      guestConfig,
      sessionLimits,
      isGuestLoading,
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

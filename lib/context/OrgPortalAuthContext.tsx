'use client'

import React, { createContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { envConfig } from '@/lib/config/env-config'

export interface OrgPortalOrg {
  id: number
  name: string
  slug: string
  status: string
  portal_email: string
}

export interface OrgPortalAuthContextType {
  org: OrgPortalOrg | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  acceptInvite: (token: string, orgSlug: string, password: string) => Promise<void>
  logout: () => void
}

export const OrgPortalAuthContext = createContext<OrgPortalAuthContextType | undefined>(undefined)

const TOKEN_KEY = 'org_portal_token'
const ORG_KEY = 'org_portal_org'

const portalAxios = axios.create({
  baseURL: `${
    typeof window !== 'undefined' && (window as any).BACKEND_URL
      ? (window as any).BACKEND_URL
      : envConfig.API_URL
  }/api/org-portal`,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  withCredentials: false,
})

portalAxios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem(TOKEN_KEY)
    if (t) config.headers.Authorization = `Bearer ${t}`
  }
  return config
})

/**
 * Purpose: Executes OrgPortalAuthProvider functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export function OrgPortalAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  )
  const [org, setOrg] = useState<OrgPortalOrg | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem(ORG_KEY)
        return s ? JSON.parse(s) : null
      } catch {
        return null
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState<boolean>(!!token)

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
      return
    }
    portalAxios
      .get<{ data: OrgPortalOrg }>('/auth/me')
      .then(res => {
        setOrg(res.data.data)
        localStorage.setItem(ORG_KEY, JSON.stringify(res.data.data))
      })
      .catch(() => {
        // Invalid/expired token — clear
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(ORG_KEY)
        setToken(null)
        setOrg(null)
      })
      .finally(() => setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const res = await portalAxios.post<{ token: string; organization: OrgPortalOrg }>(
      '/auth/login',
      { email, password }
    )
    const { token: t, organization } = res.data
    localStorage.setItem(TOKEN_KEY, t)
    localStorage.setItem(ORG_KEY, JSON.stringify(organization))
    setToken(t)
    setOrg(organization)
  }, [])

  const acceptInvite = useCallback(
    async (inviteToken: string, orgSlug: string, password: string) => {
      const res = await portalAxios.post<{ token: string; organization: OrgPortalOrg }>(
        '/auth/accept-invite',
        { token: inviteToken, org_slug: orgSlug, password, password_confirmation: password }
      )
      const { token: t, organization } = res.data
      localStorage.setItem(TOKEN_KEY, t)
      localStorage.setItem(ORG_KEY, JSON.stringify(organization))
      setToken(t)
      setOrg(organization)
    },
    []
  )

  const logout = useCallback(() => {
    // Fire-and-forget revocation
    if (token) {
      portalAxios.post('/auth/logout').catch(() => {})
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ORG_KEY)
    setToken(null)
    setOrg(null)
  }, [token])

  const value = useMemo<OrgPortalAuthContextType>(
    () => ({
      org,
      token,
      isLoading,
      isAuthenticated: !!token && !!org,
      login,
      acceptInvite,
      logout,
    }),
    [org, token, isLoading, login, acceptInvite, logout]
  )

  return <OrgPortalAuthContext.Provider value={value}>{children}</OrgPortalAuthContext.Provider>
}

/**
 * Purpose: Executes useOrgPortalAuth functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export function useOrgPortalAuth(): OrgPortalAuthContextType {
  const ctx = React.useContext(OrgPortalAuthContext)
  if (!ctx) throw new Error('useOrgPortalAuth must be used within OrgPortalAuthProvider')
  return ctx
}

/** Axios instance pre-configured with the org portal base URL — export for page use */
export { portalAxios }

'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiKeyAPI, type ApiKey } from '@/lib/api/endpoints/organization'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'

/**
 * ORG-V2-6 (OV6.2): single fetch/mutation source shared by both org-scoped
 * API-key management surfaces (/organization/api-keys dashboard page and
 * /org-portal/api-keys portal page), which previously duplicated identical
 * list-fetch/loading/usage-stats state management independently. The two
 * surfaces have genuinely different backend capabilities today (dashboard:
 * full create/revoke; portal: list + regenerate only -- routes/api/org-portal.php
 * has no key-creation route), so this hook exposes which actions are
 * available for the given mode rather than pretending both can do everything.
 */

export interface UsageStats {
  monthly_requests_used: number
  monthly_requests_limit: number
  rate_limit_per_minute: number
}

export interface CreateApiKeyPayload {
  name: string
  scopes?: string[]
  rate_limit_per_minute?: number
  expires_at?: string
}

type Mode = 'dashboard' | 'portal'

export function useOrganizationApiKeys(mode: Mode, orgId?: number) {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canFetch = mode === 'portal' || (mode === 'dashboard' && !!orgId)

  const refresh = useCallback(async () => {
    if (!canFetch) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'dashboard') {
        const res = await apiKeyAPI.list(orgId as number)
        setKeys(res.data.data ?? [])
        if (res.data.usage) setUsageStats(res.data.usage)
      } else {
        const res = await portalAxios.get<{ data: ApiKey[]; usage?: UsageStats }>('/api-keys')
        setKeys(res.data.data ?? [])
        if (res.data.usage) setUsageStats(res.data.usage)
      }
    } catch {
      setError('Failed to load API keys.')
    } finally {
      setLoading(false)
    }
  }, [mode, orgId, canFetch])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Dashboard-only: portal has no key-creation route today.
  const create =
    mode === 'dashboard'
      ? async (payload: CreateApiKeyPayload): Promise<ApiKey> => {
          const res = await apiKeyAPI.create(orgId as number, payload)
          setKeys(prev => [res.data.data, ...prev])
          return res.data.data
        }
      : undefined

  // Dashboard-only: portal has no revoke route today, only regenerate.
  const revoke =
    mode === 'dashboard'
      ? async (keyId: number): Promise<void> => {
          await apiKeyAPI.revoke(orgId as number, keyId)
          setKeys(prev => prev.filter(k => k.id !== keyId))
        }
      : undefined

  // Portal-only: dashboard has no regenerate-in-place route today, only revoke+recreate.
  const regenerate =
    mode === 'portal'
      ? async (keyId: number): Promise<string> => {
          const res = await portalAxios.post<{ token: string }>(`/api-keys/${keyId}/regenerate`)
          await refresh()
          return res.data.token
        }
      : undefined

  return { keys, usageStats, loading, error, refresh, create, revoke, regenerate }
}

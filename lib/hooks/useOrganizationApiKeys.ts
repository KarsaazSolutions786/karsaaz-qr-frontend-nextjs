'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiKeyAPI, type ApiKey } from '@/lib/api/endpoints/organization'

/**
 * Fetch/mutation source for the dashboard org-scoped API-key management
 * surface (/organization/api-keys). Was previously shared with a separate
 * /org-portal/api-keys surface via a `mode: 'dashboard' | 'portal'` switch;
 * the org-portal surface (and its Organization-as-Sanctum-principal auth) was
 * retired 2026-07-20 (ORG-V3.B), so only the dashboard mode remains.
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

export function useOrganizationApiKeys(orgId?: number) {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canFetch = !!orgId

  const refresh = useCallback(async () => {
    if (!canFetch) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await apiKeyAPI.list(orgId as number)
      setKeys(res.data.data ?? [])
      if (res.data.usage) setUsageStats(res.data.usage)
    } catch {
      setError('Failed to load API keys.')
    } finally {
      setLoading(false)
    }
  }, [orgId, canFetch])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = async (payload: CreateApiKeyPayload): Promise<ApiKey> => {
    const res = await apiKeyAPI.create(orgId as number, payload)
    setKeys(prev => [res.data.data, ...prev])
    return res.data.data
  }

  const revoke = async (keyId: number): Promise<void> => {
    await apiKeyAPI.revoke(orgId as number, keyId)
    setKeys(prev => prev.filter(k => k.id !== keyId))
  }

  return { keys, usageStats, loading, error, refresh, create, revoke }
}

'use client'

import { useState, useCallback } from 'react'
import { apiTokensAPI, type ApiToken } from '@/lib/api/endpoints/account'
import { Button } from '@/components/ui/button'

interface ApiTokensTabProps {
  userId: number | string
}

export function ApiTokensTab({ userId }: ApiTokensTabProps) {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [newToken, setNewToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmRegen, setConfirmRegen] = useState(false)

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiTokensAPI.list(userId)
      setTokens(res.data)
      setFetched(true)
    } catch {
      setError('Failed to load tokens')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Fetch on first render
  if (!fetched && !loading) {
    fetchTokens()
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiTokensAPI.generate(userId)
      setNewToken(res.data.token)
      setConfirmRegen(false)
      await fetchTokens()
    } catch {
      setError('Failed to generate token')
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (tokenId: number) => {
    try {
      setLoading(true)
      await apiTokensAPI.revoke(userId, tokenId)
      setTokens((prev) => prev.filter((t) => t.id !== tokenId))
    } catch {
      setError('Failed to revoke token')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">API Tokens</h2>
        <p className="text-sm text-gray-500 mb-6">Manage API access tokens for programmatic usage.</p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Newly generated token banner */}
        {newToken && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800 mb-2">
              New token generated — copy it now, it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-white px-3 py-2 text-sm font-mono border border-green-200 break-all">
                {newToken}
              </code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(newToken)}>
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Token list */}
        {tokens.length > 0 ? (
          <div className="space-y-3 mb-6">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono text-gray-600">{token.token_masked}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(token.token_masked)}
                  >
                    📋
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {token.last_used_at && (
                    <span className="text-xs text-gray-400">
                      Last used: {new Date(token.last_used_at).toLocaleDateString()}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRevoke(token.id)}
                    disabled={loading}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          fetched && (
            <p className="mb-6 text-sm text-gray-500">No API tokens. Generate one below.</p>
          )
        )}

        {/* Generate / Regenerate */}
        {!confirmRegen ? (
          <Button onClick={tokens.length > 0 ? () => setConfirmRegen(true) : handleGenerate} disabled={loading}>
            {loading ? 'Processing...' : tokens.length > 0 ? 'Regenerate Token' : 'Generate Token'}
          </Button>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <p className="flex-1 text-sm text-yellow-800">
              Regenerating will invalidate the current token. Continue?
            </p>
            <Button size="sm" variant="destructive" onClick={handleGenerate} disabled={loading}>
              Yes, Regenerate
            </Button>
            <Button size="sm" variant="outline" onClick={() => setConfirmRegen(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

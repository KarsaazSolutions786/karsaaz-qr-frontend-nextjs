'use client'

import { useState, useCallback } from 'react'
import { sessionsAPI, type UserSession } from '@/lib/api/endpoints/account'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SessionsTabProps {
  userId: number | string
}

function parseDevice(ua: string): string {
  if (!ua) return 'Unknown device'
  const parts: string[] = []
  if (ua.includes('Windows')) parts.push('Windows')
  else if (ua.includes('Mac')) parts.push('macOS')
  else if (ua.includes('Linux')) parts.push('Linux')
  else if (ua.includes('Android')) parts.push('Android')
  else if (ua.includes('iPhone') || ua.includes('iPad')) parts.push('iOS')

  if (ua.includes('Chrome') && !ua.includes('Edg')) parts.push('Chrome')
  else if (ua.includes('Firefox')) parts.push('Firefox')
  else if (ua.includes('Safari') && !ua.includes('Chrome')) parts.push('Safari')
  else if (ua.includes('Edg')) parts.push('Edge')

  return parts.length > 0 ? parts.join(' · ') : ua.substring(0, 40)
}

export function SessionsTab({ userId }: SessionsTabProps) {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await sessionsAPI.list(userId)
      setSessions(res.data)
      setFetched(true)
    } catch {
      setError('Failed to load sessions')
      setFetched(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (!fetched && !loading) {
    fetchSessions()
  }

  const handleRevoke = async (sessionId: string) => {
    try {
      setLoading(true)
      setError(null)
      await sessionsAPI.revoke(userId, sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setSuccess('Session revoked.')
    } catch {
      setError('Failed to revoke session')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeAll = async () => {
    try {
      setLoading(true)
      setError(null)
      await sessionsAPI.revokeAllOthers(userId)
      setSessions((prev) => prev.filter((s) => s.is_current))
      setSuccess('All other sessions revoked.')
    } catch {
      setError('Failed to revoke sessions')
    } finally {
      setLoading(false)
    }
  }

  const otherSessions = sessions.filter((s) => !s.is_current)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
          {otherSessions.length > 0 && (
            <Button size="sm" variant="destructive" onClick={handleRevokeAll} disabled={loading}>
              Revoke All Others
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Manage devices and browsers where you&apos;re currently signed in.
        </p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>}

        {loading && !fetched ? (
          <p className="text-sm text-gray-500">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No active sessions found.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {parseDevice(session.user_agent)}
                      </p>
                      {session.is_current && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {session.ip_address} · Last active: {new Date(session.last_active_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevoke(session.id)}
                    disabled={loading}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

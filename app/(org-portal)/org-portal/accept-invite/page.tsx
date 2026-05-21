'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useOrgPortalAuth } from '@/lib/context/OrgPortalAuthContext'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * Purpose: Executes AcceptInvitePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function AcceptInvitePage() {
  const params = useSearchParams()
  const router = useRouter()
  const { acceptInvite } = useOrgPortalAuth()

  const inviteToken = params.get('token') ?? ''
  const orgSlug = params.get('org') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inviteToken || !orgSlug) setError('Invalid invite link.')
  }, [inviteToken, orgSlug])

  /**
   * Purpose: Executes submit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await acceptInvite(inviteToken, orgSlug, password)
      setDone(true)
      setTimeout(() => router.push('/org-portal/dashboard'), 1500)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invite is invalid or has expired.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-indigo-50">
        <div className="rounded-2xl bg-white p-10 shadow-lg text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Welcome aboard!</h2>
          <p className="mt-2 text-gray-500">Redirecting to your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Set your password</h1>
        <p className="mb-6 text-sm text-gray-500">
          You&apos;re joining <strong>{orgSlug}</strong> on KarsaazQR. Create a password to access
          your organization portal.
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inviteToken}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Setting up your account…' : 'Activate Account & Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

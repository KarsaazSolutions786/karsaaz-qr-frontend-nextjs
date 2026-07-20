'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Building2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { organizationAPI } from '@/lib/api/endpoints/organization'

/**
 * Purpose: Landing page for an organization-invitation email link (spec
 * §3.6/§6, backend POST /api/organization-invitations/accept). Placed under
 * (public) rather than (dashboard) so a logged-out invitee can land here
 * without the route middleware bouncing them before they see anything --
 * this page decides for itself whether to prompt login or accept
 * immediately. Previously the invitation email linked to a page that never
 * existed for this invitation system (it pointed at the unrelated,
 * now-removed org-portal accept-invite page).
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-20
 */
export default function AcceptOrganizationInvitePage() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const orgSlug = params.get('org_slug') ?? ''
  const { user, isLoading: authLoading } = useAuth()

  const [status, setStatus] = useState<'idle' | 'accepting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [orgName, setOrgName] = useState('')

  useEffect(() => {
    if (authLoading || !user || !token || status !== 'idle') return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('accepting')
    organizationAPI
      .acceptInvite(token)
      .then(res => {
        setOrgName(res.data.data?.organization?.name ?? orgSlug)
        setStatus('success')
      })
      .catch(err => {
        setErrorMessage(
          err?.response?.data?.error ?? 'This invitation link is invalid or has expired.'
        )
        setStatus('error')
      })
  }, [authLoading, user, token, status, orgSlug])

  const card = (children: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {children}
      </div>
    </div>
  )

  if (!token) {
    return card(
      <>
        <XCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
        <h1 className="mb-2 text-lg font-bold text-gray-900">Invalid invitation link</h1>
        <p className="text-sm text-gray-500">This link is missing its invitation token.</p>
      </>
    )
  }

  if (authLoading) {
    return card(
      <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
    )
  }

  if (!user) {
    return card(
      <>
        <Building2 className="mx-auto mb-4 h-10 w-10 text-primary-500" />
        <h1 className="mb-2 text-lg font-bold text-gray-900">
          You&apos;ve been invited{orgSlug ? ` to join ${orgSlug}` : ''}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Sign in or create an account to accept this invitation, then open this same link from your
          email again.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] py-2.5 text-sm font-semibold text-white hover:brightness-105"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Create an account
          </Link>
        </div>
      </>
    )
  }

  if (status === 'success') {
    return card(
      <>
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-500" />
        <h1 className="mb-2 text-lg font-bold text-gray-900">You&apos;re in!</h1>
        <p className="mb-6 text-sm text-gray-500">
          You&apos;ve joined {orgName || 'the organization'}.
        </p>
        <Link
          href="/organization"
          className="inline-block rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105"
        >
          Go to organization
        </Link>
      </>
    )
  }

  if (status === 'error') {
    return card(
      <>
        <XCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
        <h1 className="mb-2 text-lg font-bold text-gray-900">Couldn&apos;t accept invitation</h1>
        <p className="text-sm text-gray-500">{errorMessage}</p>
      </>
    )
  }

  return card(
    <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
  )
}

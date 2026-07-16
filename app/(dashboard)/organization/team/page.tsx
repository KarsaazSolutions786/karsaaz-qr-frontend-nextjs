'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
import { organizationAPI, type Organization } from '@/lib/api/endpoints/organization'
import { useAuth } from '@/lib/hooks/useAuth'
import { SubUserManagement } from '@/components/features/account/SubUserManagement'

/**
 * Purpose: Self-serve "Team" page for an organization -- lets the organization's
 * owner invite/manage sub-users. Reuses the existing sub-user system as-is
 * (SubUserManagement, backed by UsersController::inviteSubUser/listSubUsers/
 * deleteSubUser) rather than a parallel org-specific mechanism: the org owner IS
 * a normal User, sub-users already inherit their parent's plan automatically via
 * UserManager::getCurrentSubscription()'s recursive lookup, and they log into the
 * normal dashboard like any other user -- exactly the behavior requested. The only
 * gap this page closes is discoverability/context: previously there was no visible
 * link between "manage your organization" and this pre-existing feature.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export default function OrganizationTeamPage() {
  const searchParams = useSearchParams()
  const orgId = Number(searchParams.get('org') ?? 0)
  const { user } = useAuth()

  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(!!orgId)

  useEffect(() => {
    if (!orgId) return
    organizationAPI
      .get(orgId)
      .then(res => setOrg(res.data.data))
      .catch(() => toast.error('Failed to load organization'))
      .finally(() => setLoading(false))
  }, [orgId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!org) {
    return <div className="p-8 text-sm text-gray-500">Organization not found.</div>
  }

  const isOwner = !!user && Number(user.id) === org.owner_user_id

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          <Users className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500">
            Invite people to {org.name} -- they get their own login and use the plan {org.name} has.
          </p>
        </div>
      </div>

      {isOwner ? (
        <SubUserManagement userId={org.owner_user_id} />
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Only the organization owner can manage the team. Ask{' '}
          {org.owner_user_id ? 'the owner' : 'an owner'} to invite you, or sign in as the owner
          account to manage sub-users here.
        </div>
      )}
    </div>
  )
}

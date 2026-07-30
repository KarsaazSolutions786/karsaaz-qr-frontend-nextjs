'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Users, UserPlus, Trash2, Wallet, X, Sparkles } from 'lucide-react'
import { useOrgStore } from '@/lib/stores/useOrgStore'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'
import {
  organizationAPI,
  organizationRoleAPI,
  organizationMemberPlanAPI,
  type OrganizationMember,
  type OrganizationRole,
} from '@/lib/api/endpoints/organization'
import { useConfirmation } from '@/components/ui/confirmation-modal'

/**
 * Purpose: Organization user management per spec §13.5 -- paginated member
 * table with role, effective plan (default vs override), and actions: invite
 * by email, create a managed user (no email round trip), edit role, assign
 * an individual plan override, remove the member. Replaces the previous
 * page, which deliberately deferred to the unrelated legacy "sub-user"
 * system before the DB-backed role model (Phase A) and member-plan
 * inheritance (Phase C) existed to build a real one on top of.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-20
 */
export default function OrganizationTeamPage() {
  const { confirm } = useConfirmation()
  const searchParams = useSearchParams()
  const orgId = Number(searchParams.get('org') ?? 0)
  const { selectedOrg } = useOrgStore()
  const { user } = useAuth()

  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [roles, setRoles] = useState<OrganizationRole[]>([])
  const [defaultPlan, setDefaultPlan] = useState<{ id: number; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [showInvite, setShowInvite] = useState(false)
  const [inviteMode, setInviteMode] = useState<'invite' | 'managed'>('invite')
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('developer')
  const [submitting, setSubmitting] = useState(false)

  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)

  useEffect(() => {
    const isAdmin = user ? isSuperAdmin(user) : false
    if (selectedOrg && (selectedOrg.plan_limit ?? 1) <= 1 && !isAdmin) {
      const hasDismissed = sessionStorage.getItem(`dismissed_org_upgrade_banner_${selectedOrg.id}`)
      if (!hasDismissed) {
        setShowUpgradeBanner(true)
      }
    } else {
      setShowUpgradeBanner(false)
    }
  }, [selectedOrg, user])

  const dismissBanner = () => {
    if (selectedOrg) {
      sessionStorage.setItem(`dismissed_org_upgrade_banner_${selectedOrg.id}`, 'true')
    }
    setShowUpgradeBanner(false)
  }

  const load = () => {
    if (!orgId) return
    setLoading(true)
    Promise.all([
      organizationAPI.getMembers(orgId),
      organizationRoleAPI.list(orgId),
      organizationMemberPlanAPI.options(orgId),
    ])
      .then(([membersRes, rolesRes, optionsRes]) => {
        setMembers(membersRes.data.data ?? [])
        setRoles(rolesRes.data.data ?? [])
        setDefaultPlan(optionsRes.data.data?.default_plan ?? null)
      })
      .catch(() => toast.error('Failed to load team'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [orgId])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (inviteMode === 'invite') {
        await organizationAPI.inviteMember(orgId, inviteEmail, inviteRole)
        toast.success('Invitation sent')
      } else {
        await organizationAPI.createManagedUser(orgId, inviteName, inviteEmail, inviteRole)
        toast.success('Member created — they received a link to set up their account')
      }
      setShowInvite(false)
      setInviteName('')
      setInviteEmail('')
      load()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ?? err?.response?.data?.message ?? 'Failed to add member'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (member: OrganizationMember, role: string) => {
    try {
      await organizationAPI.updateMember(orgId, member.id, role)
      toast.success('Role updated')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to update role')
    }
  }

  const handleRemove = async (member: OrganizationMember) => {
    if (member.role === 'owner') {
      toast.error('Cannot remove the owner')
      return
    }
    if (
      !(await confirm({
        title: 'Are you sure?',
        message: `Remove ${member.user?.name ?? 'this member'} from the organization?`,
        type: 'danger',
      }))
    )
      return
    try {
      await organizationAPI.removeMember(orgId, member.id)
      toast.success('Member removed')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to remove member')
    }
  }

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  const isAdmin = user ? isSuperAdmin(user) : false
  const isAtLimit = !isAdmin && members.length >= (selectedOrg?.plan_limit ?? 1)

  return (
    <div className="max-w-4xl">
      {showUpgradeBanner && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100/50">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-900">Unlock Team Collaboration</h3>
              <p className="mt-0.5 text-sm text-purple-700">
                Your organization is currently on a free plan. Upgrade to a paid plan to invite
                members and collaborate with your team!
              </p>
            </div>
          </div>
          <button
            onClick={dismissBanner}
            className="shrink-0 rounded-lg p-1 text-purple-400 transition-colors hover:bg-purple-100/50 hover:text-purple-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
            <Users className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Team</h1>
              {selectedOrg && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {members.length} / {selectedOrg.plan_limit ?? 1}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Manage who has access to this organization.</p>
          </div>
        </div>
        <span
          title={isAtLimit ? 'Upgrade/Purchase the plan to add more members' : undefined}
          className={isAtLimit ? 'cursor-not-allowed inline-block' : ''}
        >
          <button
            onClick={() => setShowInvite(true)}
            disabled={isAtLimit}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
              isAtLimit
                ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] hover:brightness-105'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Add member
          </button>
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Individual plan</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map(member => (
                <tr key={member.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{member.user?.name}</div>
                    <div className="text-xs text-gray-400">{member.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {member.role === 'owner' ? (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        Owner
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={e => handleRoleChange(member, e.target.value)}
                        className="rounded-lg border px-2 py-1 text-xs focus:outline-none"
                      >
                        {roles
                          .filter(r => r.slug !== 'owner')
                          .map(r => (
                            <option key={r.id} value={r.slug}>
                              {r.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : member.status === 'pending_setup' || member.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {member.status === 'pending_setup' ? 'Setting up' : member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <Wallet className="h-3 w-3" /> Organization default{' '}
                      {defaultPlan ? `(${defaultPlan.name})` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemove(member)}
                        className="text-red-400 hover:text-red-600"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleInvite}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-1 text-base font-bold text-gray-900">Add member</h2>
            <p className="mb-4 text-xs text-gray-500">
              Send an email invitation, or create the account directly.
            </p>

            <div className="mb-4 flex rounded-lg border p-1 text-xs">
              <button
                type="button"
                onClick={() => setInviteMode('invite')}
                className={`flex-1 rounded-md py-1.5 font-medium ${inviteMode === 'invite' ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}`}
              >
                Email invite
              </button>
              <button
                type="button"
                onClick={() => setInviteMode('managed')}
                className={`flex-1 rounded-md py-1.5 font-medium ${inviteMode === 'managed' ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}`}
              >
                Create account
              </button>
            </div>

            {inviteMode === 'managed' && (
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-700">Full name</label>
                <input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700">Role</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              >
                {roles
                  .filter(r => r.slug !== 'owner')
                  .map(r => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>

            {inviteMode === 'managed' && (
              <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                They&apos;ll receive a link to set their own password. No password is ever emailed.
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50"
              >
                {submitting
                  ? 'Saving…'
                  : inviteMode === 'invite'
                    ? 'Send invite'
                    : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

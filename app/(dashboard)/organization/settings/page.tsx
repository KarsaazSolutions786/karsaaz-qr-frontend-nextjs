'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus, Trash2, Users } from 'lucide-react'
import {
  organizationAPI,
  type OrganizationMember,
  type Organization,
} from '@/lib/api/endpoints/organization'

const ROLE_OPTIONS = ['admin', 'member', 'viewer']

/**
 * Purpose: Executes SettingsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function SettingsPage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)

  const [org, setOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  useEffect(() => {
    if (!orgId) return
    Promise.all([organizationAPI.get(orgId), organizationAPI.getMembers(orgId)])
      .then(([orgRes, memRes]) => {
        setOrg(orgRes.data.data)
        setMembers(memRes.data.data ?? [])
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [orgId])

  /**
   * Purpose: Executes handleInvite functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    try {
      const res = await organizationAPI.inviteMember(orgId, inviteEmail, inviteRole)
      setMembers(prev => [...prev, res.data.data])
      setInviteEmail('')
      toast.success('Member invited!')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  /**
   * Purpose: Executes handleRemove functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleRemove = async (memberId: number, role: string) => {
    if (role === 'owner') {
      toast.error('Cannot remove the owner')
      return
    }
    if (!confirm('Remove this member?')) return
    try {
      await organizationAPI.removeMember(orgId, memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
      toast.success('Member removed')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to remove member')
    }
  }

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization profile and team members.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {org && (
            <div className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-800">Profile</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <dt className="w-24 text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{org.name}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 text-gray-500">Slug</dt>
                  <dd className="font-mono text-gray-700">{org.slug}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {org.status}
                    </span>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 text-gray-500">Plan</dt>
                  <dd className="font-medium">{org.plan ?? 'Free'}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-5 py-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-gray-800">Team Members</h2>
            </div>

            <form onSubmit={handleInvite} className="border-b bg-gray-50 p-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm focus:outline-none"
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {inviting ? 'Inviting…' : 'Invite'}
                </button>
              </div>
            </form>

            <div className="divide-y">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{member.user?.name}</div>
                    <div className="text-xs text-gray-400">{member.user?.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.role === 'owner'
                          ? 'bg-purple-100 text-purple-700'
                          : member.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {member.role}
                    </span>
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemove(member.id, member.role)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

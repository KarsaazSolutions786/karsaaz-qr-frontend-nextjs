'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { UserPlus, Trash2, Users, KeyRound, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'
import {
  organizationAPI,
  orgPortalAdminAPI,
  type OrganizationMember,
  type Organization,
  type PortalCredentials,
} from '@/lib/api/endpoints/organization'

const ROLE_OPTIONS = ['admin', 'member', 'viewer']

export default function SettingsPage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)

  const [org, setOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  // Portal credentials state
  const [portalCreds, setPortalCreds] = useState<PortalCredentials | null>(null)
  const [showPortalPassword, setShowPortalPassword] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  useEffect(() => {
    if (!orgId) return
    Promise.all([
      organizationAPI.get(orgId),
      organizationAPI.getMembers(orgId),
      orgPortalAdminAPI.getCredentials(orgId),
    ])
      .then(([orgRes, memRes, credsRes]) => {
        setOrg(orgRes.data.data)
        setMembers(memRes.data.data ?? [])
        setPortalCreds(credsRes.data.data)
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [orgId])

  const handleResetPortalPassword = async () => {
    if (!confirm('Reset the portal password? The new password will be shown once.')) return
    setResettingPassword(true)
    try {
      const res = await orgPortalAdminAPI.resetPassword(orgId)
      setPortalCreds(res.data.data)
      setShowPortalPassword(true)
      toast.success('Portal password reset! Copy the new password now.')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to reset portal password')
    } finally {
      setResettingPassword(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

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

          {/* Portal Credentials */}
          {portalCreds && (
            <div className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Portal Login Credentials</h2>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Share these credentials with your API buyer so they can log in at{' '}
                <span className="font-mono text-indigo-600">/org-portal/login</span>.
              </p>
              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-3 py-2">
                  <span className="w-16 text-xs font-medium text-gray-500">Email</span>
                  <span className="flex-1 font-mono text-sm text-gray-800">
                    {portalCreds.portal_email}
                  </span>
                  <button
                    onClick={() => copyToClipboard(portalCreds.portal_email, 'Email')}
                    className="text-gray-400 hover:text-indigo-600"
                    title="Copy"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {/* Password (shown after reset) */}
                {portalCreds.portal_password && (
                  <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
                    <span className="w-16 text-xs font-medium text-gray-500">Password</span>
                    <span className="flex-1 font-mono text-sm text-gray-800">
                      {showPortalPassword ? portalCreds.portal_password : '••••••••••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPortalPassword(v => !v)}
                      className="text-gray-400 hover:text-indigo-600"
                      title={showPortalPassword ? 'Hide' : 'Show'}
                    >
                      {showPortalPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(portalCreds.portal_password!, 'Password')}
                      className="text-gray-400 hover:text-indigo-600"
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {portalCreds.portal_password && (
                  <p className="text-xs text-yellow-600">
                    ⚠ This password is shown only once. Copy it now.
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleResetPortalPassword}
                  disabled={resettingPassword}
                  className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resettingPassword ? 'animate-spin' : ''}`} />
                  {resettingPassword ? 'Resetting…' : 'Reset Portal Password'}
                </button>
              </div>
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

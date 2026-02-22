'use client'

import React, { useState } from 'react'
import { TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline'

export interface SubUserEntry {
  id: number | string
  email: string
  name?: string
  role: string
  status: 'active' | 'pending' | 'disabled'
  last_login?: string | null
}

interface InviteData {
  email: string
  role: string
}

interface SubUserManagementProps {
  users?: SubUserEntry[]
  onInvite?: (data: InviteData) => void | Promise<void>
  onRemove?: (userId: number | string) => void | Promise<void>
  maxUsers?: number
  /** Legacy prop: fetches sub-users from API when users prop is not provided */
  userId?: number
}

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  disabled: 'bg-gray-100 text-gray-500',
}

export function SubUserManagement({ users: usersProp, onInvite: onInviteProp, onRemove: onRemoveProp, maxUsers, userId }: SubUserManagementProps) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState<number | string | null>(null)
  const [apiUsers, setApiUsers] = useState<SubUserEntry[]>([])
  const [loading, setLoading] = useState(!!userId && !usersProp)

  // Legacy API-based fetching when userId is provided without users prop
  const useLegacy = !!userId && !usersProp
  const users = usersProp ?? apiUsers

  React.useEffect(() => {
    if (!useLegacy || !userId) return
    let mounted = true
    setLoading(true)
    import('@/lib/api/endpoints/users').then(({ usersAPI }) =>
      usersAPI.getSubUsers(userId)
    ).then((data) => {
      if (mounted) {
        const mapped: SubUserEntry[] = (Array.isArray(data) ? data : []).map((u) => {
          const raw = u as unknown as Record<string, unknown>
          return {
            id: Number(u.id),
            email: u.email || '',
            name: u.name || undefined,
            role: (raw.role as string) || 'viewer',
            status: 'active' as const,
            last_login: (raw.last_login as string) || null,
          }
        })
        setApiUsers(mapped)
      }
    }).catch(() => {
      if (mounted) setApiUsers([])
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [useLegacy, userId])

  const onInvite = onInviteProp ?? (async () => {})
  const onRemove = onRemoveProp ?? (async () => {})

  const canInvite = !maxUsers || users.length < maxUsers

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setSaving(true)
    try {
      await onInvite({ email: inviteEmail.trim(), role: inviteRole })
      setInviteEmail('')
      setInviteRole('viewer')
      setShowInvite(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(userId: number | string) {
    if (!confirm('Remove this user? They will lose all access.')) return
    setRemoving(userId)
    try {
      await onRemove(userId)
    } finally {
      setRemoving(null)
    }
  }

  function getInitials(name?: string, email?: string) {
    const src = name || email || '?'
    return src
      .split(/[\s@]/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sub-Users</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage team members and their access
            {maxUsers && (
              <span className="ml-2 text-xs text-gray-400">
                ({users.length}/{maxUsers} seats used)
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowInvite(!showInvite)}
          disabled={!canInvite}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Usage bar */}
      {maxUsers && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Usage</span>
            <span>{users.length} of {maxUsers} users</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((users.length / maxUsers) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Invite form */}
      {showInvite && canInvite && (
        <form onSubmit={handleInvite} className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={saving || !inviteEmail}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Sending...' : 'Send Invite'}
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users list */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
            Loading sub-users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">👥</span>
            <p className="text-sm text-gray-500 mt-2">No sub-users yet. Invite someone to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                          {getInitials(user.name, user.email)}
                        </div>
                        <div className="min-w-0">
                          {user.name && (
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          )}
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm text-gray-700 capitalize">{user.role}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[user.status] || STATUS_BADGE.disabled}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(user.id)}
                        disabled={removing === user.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        title="Remove user"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

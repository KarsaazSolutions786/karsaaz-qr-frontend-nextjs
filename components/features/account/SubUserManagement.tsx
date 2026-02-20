'use client'

import { useState, useEffect, useCallback } from 'react'
import { usersAPI } from '@/lib/api/endpoints/users'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { FolderSelectModal } from '@/components/common/FolderSelectModal'
import { TrashIcon, FolderIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import type { User } from '@/types/entities/user'
import type { Folder } from '@/types/entities/folder'

interface SubUserManagementProps {
  userId: number
}

interface SubUser extends User {
  subuser_folders?: { id: string | number; name: string }[]
}

export function SubUserManagement({ userId }: SubUserManagementProps) {
  const [subUsers, setSubUsers] = useState<SubUser[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [folderModalUser, setFolderModalUser] = useState<SubUser | null>(null)

  // Invite form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [folderId, setFolderId] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [users, folderList] = await Promise.all([
        usersAPI.getSubUsers(userId),
        foldersAPI.list(),
      ])
      setSubUsers(Array.isArray(users) ? users : [])
      setFolders(Array.isArray(folderList) ? folderList : [])
    } catch {
      setSubUsers([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !folderId) return

    setSaving(true)
    try {
      await usersAPI.inviteSubUser(userId, {
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim() || undefined,
        folder_id: folderId,
      })
      setName('')
      setEmail('')
      setMobile('')
      setFolderId('')
      await fetchData()
    } catch {
      // Failed
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(subUserId: number) {
    if (!confirm('Remove this sub-user? They will lose access.')) return
    setDeleting(subUserId)
    try {
      await usersAPI.deleteSubUser(userId, subUserId)
      await fetchData()
    } catch {
      // Failed
    } finally {
      setDeleting(null)
    }
  }

  async function handleFolderUpdate(subUser: SubUser, folderIds: string[]) {
    try {
      await usersAPI.updateSubUserFolders(userId, Number(subUser.id), folderIds)
      await fetchData()
    } catch {
      // Failed
    }
    setFolderModalUser(null)
  }

  function getInitials(n: string) {
    return n
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Sub-Users</h3>
        <p className="text-sm text-gray-500 mt-1">
          Invite team members and assign folder access
        </p>
      </div>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+1234567890"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Folder *</label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            >
              <option value="">Select folder...</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving || !name || !email || !folderId}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <UserPlusIcon className="w-4 h-4" />
          {saving ? 'Inviting...' : 'Invite Sub-User'}
        </button>
      </form>

      {/* Sub-Users List */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
            Loading sub-users...
          </div>
        ) : subUsers.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">👥</span>
            <p className="text-sm text-gray-500 mt-2">No sub-users yet. Invite someone above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subUsers.map((su) => (
              <div
                key={su.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  {getInitials(su.name || su.email)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{su.name || 'Unnamed'}</p>
                  <p className="text-xs text-gray-500 truncate">{su.email}</p>
                  {su.subuser_folders && su.subuser_folders.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {su.subuser_folders.map((f) => (
                        <span
                          key={f.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          <FolderIcon className="w-3 h-3" />
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setFolderModalUser(su)}
                    className="p-1.5 text-gray-400 hover:text-purple-600"
                    title="Manage folders"
                  >
                    <FolderIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(Number(su.id))}
                    disabled={deleting === Number(su.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50"
                    title="Remove"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Folder Select Modal */}
      {folderModalUser && (
        <FolderSelectModal
          selectedIds={(folderModalUser.subuser_folders || []).map((f) => String(f.id))}
          multi
          onConfirm={(ids) => handleFolderUpdate(folderModalUser, ids)}
          onClose={() => setFolderModalUser(null)}
        />
      )}
    </div>
  )
}

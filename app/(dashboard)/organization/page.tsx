'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Building2,
  KeyRound,
  BarChart3,
  Wallet,
  Plus,
  AlertCircle,
  Users,
  ShieldAlert,
} from 'lucide-react'
import { organizationAPI, type Organization } from '@/lib/api/endpoints/organization'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'

/**
 * Purpose: Executes OrganizationPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrganizationPage() {
  const { user } = useAuth()
  const canManageAllOrgs = isSuperAdmin(user)
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org)
  }

  useEffect(() => {
    organizationAPI
      .list()
      .then(res => setOrgs(res.data.data ?? []))
      .catch(() => toast.error('Failed to load organizations'))
      .finally(() => setLoading(false))
  }, [])

  /**
   * Purpose: Executes copyToClipboard functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  /**
   * Purpose: Executes handleCreate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return
    setCreating(true)
    try {
      const res = await organizationAPI.create({ name: newOrgName.trim() })
      setOrgs(prev => [...prev, res.data.data])
      setNewOrgName('')
      setShowForm(false)
      toast.success('Organization created!')
    } catch {
      toast.error('Failed to create organization')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage organizations and their API access to the QR platform.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Organization
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Create Organization</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newOrgName}
              onChange={e => setNewOrgName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="flex-1 rounded-lg border px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-5 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50 transition-all"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {orgs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-400" />
          <p className="font-medium text-gray-600">No organizations yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first organization to get API access.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map(org => (
            <div
              key={org.id}
              onClick={() => handleOrgSelect(org)}
              className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all ${
                selectedOrg?.id === org.id
                  ? 'ring-2 ring-primary-500 border-primary-500'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{org.name}</h3>
                    <p className="text-xs text-gray-400">{org.slug}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    org.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : org.status === 'suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {org.status}
                </span>
              </div>

              {/* Stats row */}
              <div className="mb-4 flex gap-4 text-center">
                <div className="flex-1 rounded-lg bg-gray-50 py-2">
                  <Wallet className="mx-auto mb-1 h-4 w-4 text-primary-500" />
                  <div className="text-sm font-bold text-gray-900">{org.credits?.balance ?? 0}</div>
                  <div className="text-xs text-gray-400">Credits</div>
                </div>
                <div className="flex-1 rounded-lg bg-gray-50 py-2">
                  <KeyRound className="mx-auto mb-1 h-4 w-4 text-green-500" />
                  <div className="text-sm font-bold text-gray-900">{org.plan ?? 'Free'}</div>
                  <div className="text-xs text-gray-400">Plan</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {canManageAllOrgs && (
                  <Link
                    href={`/organization/manage/${org.id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    <ShieldAlert className="h-3 w-3" /> Manage
                  </Link>
                )}
                <Link
                  href={`/organization/api-keys?org=${org.id}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <KeyRound className="h-3 w-3" /> API Keys
                </Link>
                <Link
                  href={`/organization/usage?org=${org.id}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <BarChart3 className="h-3 w-3" /> Usage
                </Link>
                <Link
                  href={`/organization/team?org=${org.id}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Users className="h-3 w-3" /> Team
                </Link>
                {canManageAllOrgs && (
                  <Link
                    href={`/organization/plans?org=${org.id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Wallet className="h-3 w-3" /> Plan
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

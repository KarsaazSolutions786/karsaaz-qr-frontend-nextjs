'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Building2,
  KeyRound,
  BarChart3,
  Wallet,
  Plus,
  Users,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { useConfirmation } from '@/components/ui/confirmation-modal'
import { organizationAPI, type Organization } from '@/lib/api/endpoints/organization'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'
import { useOrgStore } from '@/lib/stores/useOrgStore'
import { useOrganizations } from '@/lib/hooks/queries/useOrganizations'

/**
 * Purpose: Executes OrganizationPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrganizationPage() {
  const { user } = useAuth()
  const canManageAllOrgs = isSuperAdmin(user)
  const { data: orgs = [], isLoading, refetch } = useOrganizations()
  const [creating, setCreating] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { selectedOrg, setSelectedOrg } = useOrgStore()
  const { confirm } = useConfirmation()

  const handleOrgSelect = (org: Organization) => {
    if (selectedOrg?.id === org.id) return
    setSelectedOrg(org)
    toast.success('Organization successfully selected')
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleDelete = async (org: Organization, e: React.MouseEvent) => {
    e.stopPropagation()
    const isConfirmed = await confirm({
      title: 'Delete Organization',
      message: `Are you sure you want to delete "${org.name}"? This action cannot be undone.`,
      type: 'danger',
    })

    if (isConfirmed) {
      try {
        await organizationAPI.delete(org.id)
        await refetch()
        if (selectedOrg?.id === org.id) {
          setSelectedOrg(null)
        }
        toast.success('Organization deleted successfully')
      } catch {
        toast.error('Failed to delete organization')
      }
    }
  }
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return
    setCreating(true)
    try {
      await organizationAPI.create({ name: newOrgName.trim() })
      await refetch()
      setNewOrgName('')
      setShowForm(false)
      toast.success('Organization created!')
    } catch {
      toast.error('Failed to create organization')
    } finally {
      setCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px]">
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
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
            <Building2 className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No organizations yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Get started by creating your first organization to manage API access, teams, and usage
            analytics.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-105 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Organization
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map(org => (
            <div
              key={org.id}
              onClick={() => handleOrgSelect(org)}
              className={`group cursor-pointer rounded-2xl bg-white transition-all duration-300 ease-in-out ${
                selectedOrg?.id === org.id
                  ? 'shadow-[0_0_0_2px_rgba(217,70,239,0.3),_0_8px_30px_rgb(0,0,0,0.08)] -translate-y-1'
                  : 'border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1'
              }`}
            >
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 ring-1 ring-primary-100 shadow-inner">
                      <Building2 className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-400">{org.slug}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                      org.status === 'active'
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/10'
                        : org.status === 'suspended'
                          ? 'bg-red-50 text-red-700 ring-1 ring-red-600/10'
                          : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10'
                    }`}
                  >
                    {org.status}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex text-center divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/50 py-3 mb-1">
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Credits
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Wallet className="h-4 w-4 text-primary-400" />
                      <span className="text-base font-bold text-gray-900">
                        {org.credits?.balance ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Plan
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <KeyRound className="h-4 w-4 text-green-500" />
                      <span className="text-base font-bold text-gray-900">
                        {org.plan ?? 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions - Mini-Grid */}
              <div
                className="grid grid-cols-2 md:grid-cols-3 border-t border-gray-100 rounded-b-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {canManageAllOrgs && (
                  <Link
                    href={`/organization/manage/${org.id}`}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-semibold text-primary-600 bg-white hover:bg-primary-50 hover:text-primary-700 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0" />{' '}
                    <span className="truncate">Manage</span>
                  </Link>
                )}
                <Link
                  href={`/organization/api-keys?org=${org.id}`}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                >
                  <KeyRound className="h-4 w-4 shrink-0" />{' '}
                  <span className="truncate">API Keys</span>
                </Link>
                <Link
                  href={`/organization/usage?org=${org.id}`}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                >
                  <BarChart3 className="h-4 w-4 shrink-0" /> <span className="truncate">Usage</span>
                </Link>
                <Link
                  href={`/organization/team?org=${org.id}`}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                >
                  <Users className="h-4 w-4 shrink-0" /> <span className="truncate">Team</span>
                </Link>
                {canManageAllOrgs && (
                  <Link
                    href={`/organization/plans?org=${org.id}`}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                  >
                    <Wallet className="h-4 w-4 shrink-0" /> <span className="truncate">Plan</span>
                  </Link>
                )}
                <button
                  onClick={e => handleDelete(org, e)}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 text-[13px] font-medium text-red-600 bg-white hover:bg-red-50 hover:text-red-700 transition-colors border-l border-t border-gray-100 -ml-px -mt-px"
                >
                  <Trash2 className="h-4 w-4 shrink-0" /> <span className="truncate">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

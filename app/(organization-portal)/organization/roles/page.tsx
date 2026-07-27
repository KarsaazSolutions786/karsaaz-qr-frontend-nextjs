'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ShieldCheck, Lock, Plus, Trash2, X, Check } from 'lucide-react'
import { organizationRoleAPI, type OrganizationRole } from '@/lib/api/endpoints/organization'
import { useConfirmation } from '@/components/ui/confirmation-modal'

const PERMISSION_GROUPS: Record<string, string> = {
  organization: 'Organization',
  members: 'Members',
  billing: 'Billing',
  credits: 'Credits',
  usage: 'Usage',
  api_keys: 'API Keys',
  webhooks: 'Webhooks',
  audit_logs: 'Audit Logs',
}

function groupPermissions(permissions: string[]) {
  const groups: Record<string, string[]> = {}
  for (const p of permissions) {
    const prefix = p.split('.')[0] ?? p
    const label = PERMISSION_GROUPS[prefix] ?? prefix
    groups[label] = groups[label] ?? []
    groups[label].push(p)
  }
  return groups
}

/**
 * Purpose: Roles & permissions management per spec §13.6 -- role list,
 * create/edit custom roles with grouped permission checkboxes, protected
 * system-role indicators, member count, delete protection when in use.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-20
 */
export default function OrganizationRolesPage() {
  const { confirm } = useConfirmation()
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)

  const [roles, setRoles] = useState<OrganizationRole[]>([])
  const [allPermissions, setAllPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<OrganizationRole | 'new' | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formPermissions, setFormPermissions] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const load = () => {
    if (!orgId) return
    setLoading(true)
    Promise.all([organizationRoleAPI.list(orgId), organizationRoleAPI.permissions(orgId)])
      .then(([rolesRes, permsRes]) => {
        setRoles(rolesRes.data.data ?? [])
        setAllPermissions(permsRes.data.data ?? [])
      })
      .catch(() => toast.error('Failed to load roles'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [orgId])

  const openCreate = () => {
    setEditing('new')
    setFormName('')
    setFormSlug('')
    setFormPermissions(new Set())
  }

  const openEdit = (role: OrganizationRole) => {
    setEditing(role)
    setFormName(role.name)
    setFormSlug(role.slug)
    setFormPermissions(new Set(role.permissions.map(p => p.permission_slug)))
  }

  const togglePermission = (slug: string) => {
    setFormPermissions(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const handleSave = async () => {
    if (!formName.trim() || formPermissions.size === 0) {
      toast.error('Name and at least one permission are required')
      return
    }
    setSaving(true)
    try {
      if (editing === 'new') {
        const slug =
          formSlug.trim() ||
          formName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
        await organizationRoleAPI.create(orgId, {
          name: formName.trim(),
          slug,
          permissions: Array.from(formPermissions),
        })
        toast.success('Role created')
      } else if (editing) {
        await organizationRoleAPI.update(orgId, editing.id, {
          name: formName.trim(),
          permissions: Array.from(formPermissions),
        })
        toast.success('Role updated')
      }
      setEditing(null)
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save role')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (role: OrganizationRole) => {
    if (
      !(await confirm({
        title: 'Are you sure?',
        message: `Delete the "${role.name}" role?`,
        type: 'danger',
      }))
    )
      return
    try {
      await organizationRoleAPI.delete(orgId, role.id)
      toast.success('Role deleted')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to delete role')
    }
  }

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  const grouped = groupPermissions(allPermissions)

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control what each role can see and do inside this organization.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 transition-all"
        >
          <Plus className="h-4 w-4" />
          New role
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm divide-y">
          {roles.map(role => (
            <div key={role.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
                  {role.is_system ? (
                    <Lock className="h-4 w-4 text-primary-500" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-primary-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{role.name}</span>
                    {role.is_system && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {role.permissions.length} permission{role.permissions.length === 1 ? '' : 's'}
                    {typeof role.members_count === 'number' &&
                      ` · ${role.members_count} member${role.members_count === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(role)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {role.is_system ? 'View' : 'Edit'}
                </button>
                {!role.is_system && (
                  <button
                    onClick={() => handleDelete(role)}
                    className="text-red-400 hover:text-red-600"
                    title="Delete role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editing === 'new'
                  ? 'New role'
                  : editing.is_system
                    ? editing.name
                    : `Edit ${editing.name}`}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editing !== 'new' && editing.is_system ? (
              <p className="mb-4 text-sm text-gray-500">
                System roles ship with a fixed permission set and can&apos;t be edited. Create a
                custom role instead if you need different permissions.
              </p>
            ) : (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-gray-700">Role name</label>
                <input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Support Lead"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  disabled={editing !== 'new' && (editing as OrganizationRole).is_system}
                />
              </div>
            )}

            <div className="space-y-4">
              {Object.entries(grouped).map(([label, perms]) => (
                <div key={label}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {label}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {perms.map(p => {
                      const checked = formPermissions.has(p)
                      const disabled = editing !== 'new' && (editing as OrganizationRole).is_system
                      return (
                        <button
                          key={p}
                          type="button"
                          disabled={disabled}
                          onClick={() => togglePermission(p)}
                          className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs disabled:cursor-not-allowed disabled:opacity-60 ${
                            checked
                              ? 'border-primary-300 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              checked ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                            }`}
                          >
                            {checked && <Check className="h-3 w-3 text-white" />}
                          </span>
                          <span className="truncate font-mono">{p}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!(editing !== 'new' && editing.is_system) && (
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save role'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

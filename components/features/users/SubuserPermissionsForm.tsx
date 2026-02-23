'use client'

import { useMemo, useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface PermissionGroup {
  name: string
  permissions: string[]
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: 'QR Codes',
    permissions: ['qrcode.list', 'qrcode.create', 'qrcode.update', 'qrcode.delete'],
  },
  {
    name: 'Analytics',
    permissions: ['analytics.view', 'analytics.export'],
  },
  {
    name: 'Billing',
    permissions: ['billing.view', 'billing.manage'],
  },
  {
    name: 'Settings',
    permissions: ['settings.view', 'settings.update'],
  },
  {
    name: 'Users',
    permissions: ['user.list', 'user.create', 'user.update', 'user.delete'],
  },
]

interface SubuserPermissionsFormProps {
  userId: number | string
  permissions: string[]
  onChange: (permissions: string[]) => void
}

export function SubuserPermissionsForm({ userId: _userId, permissions, onChange }: SubuserPermissionsFormProps) {
  const allPermissions = useMemo(
    () => PERMISSION_GROUPS.flatMap((g) => g.permissions),
    []
  )

  const isFullAccess = allPermissions.every((p) => permissions.includes(p))

  const togglePermission = useCallback(
    (perm: string, checked: boolean) => {
      if (checked) {
        onChange([...permissions, perm])
      } else {
        onChange(permissions.filter((p) => p !== perm))
      }
    },
    [permissions, onChange]
  )

  const toggleGroup = useCallback(
    (group: PermissionGroup, checked: boolean) => {
      if (checked) {
        const newPerms = new Set([...permissions, ...group.permissions])
        onChange(Array.from(newPerms))
      } else {
        onChange(permissions.filter((p) => !group.permissions.includes(p)))
      }
    },
    [permissions, onChange]
  )

  const toggleFullAccess = useCallback(
    (checked: boolean) => {
      onChange(checked ? [...allPermissions] : [])
    },
    [allPermissions, onChange]
  )

  const formatPermissionLabel = (perm: string) => {
    const action = perm.split('.')[1] || perm
    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Full Access</p>
          <p className="text-xs text-gray-500">Grant all permissions to this sub-user</p>
        </div>
        <Switch checked={isFullAccess} onCheckedChange={toggleFullAccess} />
      </div>

      {/* Permission Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PERMISSION_GROUPS.map((group) => {
          const groupCheckedCount = group.permissions.filter((p) => permissions.includes(p)).length
          const allGroupChecked = groupCheckedCount === group.permissions.length
          const someGroupChecked = groupCheckedCount > 0 && !allGroupChecked

          return (
            <div
              key={group.name}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              {/* Group header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allGroupChecked}
                    indeterminate={someGroupChecked}
                    onCheckedChange={(checked) => toggleGroup(group, checked)}
                  />
                  <Label className="text-sm font-semibold text-gray-900 cursor-pointer">
                    {group.name}
                  </Label>
                </div>
                <span className="text-xs text-gray-400">
                  {groupCheckedCount}/{group.permissions.length}
                </span>
              </div>

              {/* Individual permissions */}
              <div className="space-y-2">
                {group.permissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      checked={permissions.includes(perm)}
                      onCheckedChange={(checked) => togglePermission(perm, checked)}
                    />
                    <Label className="text-sm text-gray-700 cursor-pointer">
                      {formatPermissionLabel(perm)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

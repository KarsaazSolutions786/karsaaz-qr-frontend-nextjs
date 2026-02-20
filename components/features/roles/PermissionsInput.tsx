'use client'

import { usePermissions } from '@/lib/hooks/queries/useRoles'
import { Loader2 } from 'lucide-react'

interface PermissionsInputProps {
  value: number[]
  onChange: (ids: number[]) => void
}

export function PermissionsInput({ value, onChange }: PermissionsInputProps) {
  const { data: groups, isLoading } = usePermissions()

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const toggleGroup = (groupIds: number[]) => {
    const allSelected = groupIds.every((id) => value.includes(id))
    if (allSelected) {
      // Deselect all in group
      onChange(value.filter((id) => !groupIds.includes(id)))
    } else {
      // Select all in group (add missing ones)
      const toAdd = groupIds.filter((id) => !value.includes(id))
      onChange([...value, ...toAdd])
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading permissions...
      </div>
    )
  }

  if (!groups || groups.length === 0) {
    return <p className="text-sm text-gray-500 italic py-2">No permissions available.</p>
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupIds = group.permissions.map((p) => p.id)
        const selectedCount = groupIds.filter((id) => value.includes(id)).length
        const allSelected = selectedCount === groupIds.length
        const someSelected = selectedCount > 0 && selectedCount < groupIds.length

        return (
          <div key={group.name} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group header / select-all */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <input
                type="checkbox"
                id={`group-${group.name}`}
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onChange={() => toggleGroup(groupIds)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`group-${group.name}`}
                className="text-sm font-semibold text-gray-700 cursor-pointer capitalize select-none"
              >
                {group.name}
              </label>
              <span className="ml-auto text-xs text-gray-400">
                {selectedCount}/{groupIds.length}
              </span>
            </div>

            {/* Individual permissions */}
            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.permissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-start gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(permission.id)}
                    onChange={() => toggle(permission.id)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-gray-800">{permission.name}</p>
                    {permission.description && (
                      <p className="text-xs text-gray-400">{permission.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

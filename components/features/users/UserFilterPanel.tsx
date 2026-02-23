'use client'

import { useState, useCallback } from 'react'
import { useRoles } from '@/lib/hooks/queries/useRoles'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter, X } from 'lucide-react'

export interface UserFilters {
  role_id?: string
  status?: string
  plan_id?: string
  date_from?: string
  date_to?: string
}

interface UserFilterPanelProps {
  onChange: (filters: UserFilters) => void
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'banned', label: 'Banned' },
]

export function UserFilterPanel({ onChange }: UserFilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<UserFilters>({})

  const { data: rolesData } = useRoles()
  const { data: plansData } = usePlans()

  const roles = rolesData?.data ?? []
  const plans = plansData?.data ?? []

  const update = useCallback(
    (key: keyof UserFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleApply = () => {
    // Strip empty values
    const clean: UserFilters = {}
    if (filters.role_id) clean.role_id = filters.role_id
    if (filters.status) clean.status = filters.status
    if (filters.plan_id) clean.plan_id = filters.plan_id
    if (filters.date_from) clean.date_from = filters.date_from
    if (filters.date_to) clean.date_to = filters.date_to
    onChange(clean)
    setOpen(false)
  }

  const handleClear = () => {
    setFilters({})
    onChange({})
    setOpen(false)
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm ${
          activeCount > 0
            ? 'border-blue-300 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        Advanced Filters
        {activeCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
            {activeCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role */}
        <div>
          <Label className="mb-1.5 block">Role</Label>
          <select
            value={filters.role_id || ''}
            onChange={(e) => update('role_id', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <Label className="mb-1.5 block">Status</Label>
          <select
            value={filters.status || ''}
            onChange={(e) => update('status', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Plan */}
        <div>
          <Label className="mb-1.5 block">Subscription Plan</Label>
          <select
            value={filters.plan_id || ''}
            onChange={(e) => update('plan_id', e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Plans</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Joined Range */}
        <div>
          <Label className="mb-1.5 block">Date Joined</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => update('date_from', e.target.value)}
              placeholder="From"
            />
            <Input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => update('date_to', e.target.value)}
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
        <Button size="sm" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

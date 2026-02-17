'use client'

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { Permission } from '@/types/entities/permissions'
import { hasPermission, hasAllPermissions, hasAnyPermission, hasRole, isAdmin, isModerator } from '@/lib/utils/permissions'

export function usePermissions() {
  const { user } = useAuth()

  return useMemo(
    () => ({
      hasPermission: (permission: Permission) => hasPermission(user, permission),
      hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
      hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
      hasRole: (role: string) => hasRole(user, role),
      isAdmin: () => isAdmin(user),
      isModerator: () => isModerator(user),
    }),
    [user]
  )
}

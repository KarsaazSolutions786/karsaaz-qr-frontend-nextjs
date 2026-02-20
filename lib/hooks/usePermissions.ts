'use client'

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import {
  permitted,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isSuperAdmin,
  isAdmin,
  isModerator,
  isCustomer,
  isClient,
  isSubUser,
  userHomePage,
  verified,
} from '@/lib/utils/permissions'

export function usePermissions() {
  const { user } = useAuth()

  return useMemo(
    () => ({
      /** Core RBAC check — exact replica of original permitted(slug) */
      permitted: (slug: string) => permitted(user, slug),
      hasPermission: (permission: string) => hasPermission(user, permission),
      hasAllPermissions: (permissions: string[]) => hasAllPermissions(user, permissions),
      hasAnyPermission: (permissions: string[]) => hasAnyPermission(user, permissions),
      hasRole: (role: string) => hasRole(user, role),
      /** True when any role has super_admin flag — bypasses all permission checks */
      isSuperAdmin: () => isSuperAdmin(user),
      /** @deprecated Use isSuperAdmin() */
      isAdmin: () => isAdmin(user),
      isModerator: () => isModerator(user),
      /** True for Client or Sub User roles (regular paying customers) */
      isCustomer: () => isCustomer(user),
      /** True if user has a 'Client' role */
      isClient: () => isClient(user),
      /** True if user.is_sub is set (sub-account under a parent) */
      isSubUser: () => isSubUser(user),
      /** Home page path — sub users use parent's role home_page */
      userHomePage: () => userHomePage(user),
      /** Email verification status */
      verified: () => verified(user),
    }),
    [user]
  )
}


import { User } from '@/types/entities/user'

// Re-export the Permission type for backward compat
export type Permission = string

/**
 * Purpose: Check whether the user's email is verified. Matches original: verified() → email_verified_at is not empty
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function verified(user: User | null | undefined): boolean {
  if (!user) return false
  return !!user.email_verified_at
}

/**
 * Purpose: Check whether the user is a Super Admin. Super Admins bypass ALL permission checks. Matches original: isSuperAdmin() — any role where role.super_admin is truthy
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isSuperAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  return user.roles?.some(r => !!r.super_admin) ?? false
}

/**
 * Purpose: Check whether the user is a regular customer (Client or Sub User role). Matches original: isCustomer() → roles[0].name === 'Client' || 'Sub User'
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isCustomer(user: User | null | undefined): boolean {
  if (!user) return false
  const primaryRoleName = user.roles?.[0]?.name
  return primaryRoleName === 'Client' || primaryRoleName === 'Sub User'
}

/**
 * Purpose: Check whether the user is a Client (not Sub User). Matches original: isClient() → any role named 'Client'
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isClient(user: User | null | undefined): boolean {
  if (!user) return false
  return user.roles?.some(r => r.name === 'Client') ?? false
}

/**
 * Purpose: Check whether the user is a Sub User. Matches original: isSubUser() → user.is_sub flag
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isSubUser(user: User | null | undefined): boolean {
  return !!user?.is_sub
}

/**
 * Purpose: Resolve the home page for a user after login. Sub users use parent_user.roles[0].home_page (parent's role home). Regular users use roles[0].home_page. Falls back to '/qrcodes'. Matches original: userHomePage()
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function userHomePage(user: User | null | undefined): string {
  if (!user) return '/qrcodes/new'
  let homePage: string | undefined
  if (user.is_sub && user.parent_user?.roles?.[0]?.home_page) {
    homePage = user.parent_user.roles[0].home_page
  } else {
    homePage = user.roles?.[0]?.home_page
  }
  // Strip legacy /dashboard prefix (old Lit frontend paths)
  if (homePage?.startsWith('/dashboard')) {
    homePage = homePage.replace('/dashboard', '')
  }
  return homePage || '/qrcodes/new'
}

/**
 * Purpose: Core RBAC permission check — exact replica of original permitted(slug). Logic: 1. Empty slug → always allowed (public route) 2. No user / no roles → denied 3. Super Admin → always allowed 4. Email not verified → denied 5. Flatten all role permissions and check if slug matches Matches original src/core/auth.js permitted()
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function permitted(user: User | null | undefined, slug: string | undefined | null): boolean {
  // No permission required
  if (!slug || slug.trim() === '') return true
  // No user loaded
  if (!user || !user.roles || user.roles.length === 0) return false
  // Super admin bypasses ALL checks
  if (isSuperAdmin(user)) return true
  // Email must be verified
  if (!verified(user)) return false
  // Flatten all permissions from all roles and check for slug match
  const allPermissions = user.roles.flatMap(role => role.permissions ?? [])
  return allPermissions.some(p => {
    if (typeof p === 'string') return p === slug
    // PermissionObject shape from API: { id, slug, name }
    return (p as { slug?: string }).slug === slug
  })
}

/**
 * Purpose: Check if user has a specific permission slug. Convenience wrapper around permitted().
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function hasPermission(user: User | null | undefined, permission: string): boolean {
  return permitted(user, permission)
}

/**
 * Purpose: Check if user has all of the specified permissions
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function hasAllPermissions(user: User | null | undefined, permissions: string[]): boolean {
  return permissions.every(p => permitted(user, p))
}

/**
 * Purpose: Check if user has any of the specified permissions
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function hasAnyPermission(user: User | null | undefined, permissions: string[]): boolean {
  return permissions.some(p => permitted(user, p))
}

/**
 * Purpose: Check if user has a specific role name (e.g. 'Client', 'Admin', 'Sub User')
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user) return false
  return user.roles?.some(r => r.name === role) ?? false
}

/**
 * Purpose: Checks if admin.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isAdmin(user: User | null | undefined): boolean {
  return isSuperAdmin(user)
}

/**
 * Purpose: Checks if moderator.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isModerator(user: User | null | undefined): boolean {
  if (!user) return false
  const role = user.roles?.[0]?.name
  return role === 'moderator' || role === 'admin'
}

/**
 * Purpose: Check if user can perform action on resource This is a helper that combines permission and ownership checks
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function canPerformAction(
  user: User | null | undefined,
  permission: string,
  resourceOwnerId?: string
): boolean {
  if (!user) return false

  // Admins can do everything
  if (isAdmin(user)) return true

  // Check if user has the required permission
  if (!hasPermission(user, permission)) return false

  // If resource has an owner, check if user owns it
  if (resourceOwnerId !== undefined) {
    return String(user.id) === resourceOwnerId
  }

  return true
}

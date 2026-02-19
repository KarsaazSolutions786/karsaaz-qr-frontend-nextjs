import { Permission, PERMISSIONS, ROLES } from '@/types/entities/permissions'
import { User } from '@/types/entities/user'

/**
 * Get all permissions for a user from their roles
 */
function getUserPermissions(user: User): Permission[] {
  // Check new roles array first (from API)
  if (user.roles && user.roles.length > 0) {
    return user.roles.flatMap(r => r.permissions ?? [])
  }
  // Fallback to flat permissions array
  return user.permissions ?? []
}

/**
 * Get the user's primary role name
 */
function getUserRole(user: User): string | undefined {
  if (user.roles && user.roles.length > 0) {
    return user.roles[0]?.name
  }
  return user.role
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false
  return getUserPermissions(user).includes(permission)
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false
  const userPerms = getUserPermissions(user)
  return permissions.every(permission => userPerms.includes(permission))
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false
  const userPerms = getUserPermissions(user)
  return permissions.some(permission => userPerms.includes(permission))
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user) return false
  const userRole = getUserRole(user)
  return userRole === role
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  // Check super_admin flag in roles
  if (user.roles?.some(r => r.super_admin === 1)) return true
  return hasRole(user, 'admin')
}

/**
 * Check if user is moderator or admin
 */
export function isModerator(user: User | null | undefined): boolean {
  if (!user) return false
  const role = getUserRole(user)
  return role === 'moderator' || role === 'admin'
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: string): Permission[] {
  const roleDefinition = ROLES.find(r => r.name === role)
  return roleDefinition?.permissions || []
}

/**
 * Check if user can perform action on resource
 * This is a helper that combines permission and ownership checks
 */
export function canPerformAction(
  user: User | null | undefined,
  permission: Permission,
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

export { PERMISSIONS }

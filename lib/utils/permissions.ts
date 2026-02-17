import { Permission, PERMISSIONS, ROLES } from '@/types/entities/permissions'
import { User } from '@/types/entities/user'

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false
  return permissions.every(permission => user.permissions.includes(permission))
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false
  return permissions.some(permission => user.permissions.includes(permission))
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user) return false
  return user.role === role
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'admin')
}

/**
 * Check if user is moderator or admin
 */
export function isModerator(user: User | null | undefined): boolean {
  if (!user) return false
  return user.role === 'moderator' || user.role === 'admin'
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
    return user.id === resourceOwnerId
  }

  return true
}

export { PERMISSIONS }

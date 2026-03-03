/**
 * Unit Tests for Permission Utility Functions
 * @file tests/unit/utils/permissions.test.ts
 *
 * Tests the RBAC permission system:
 * - Role detection: isSuperAdmin, isCustomer, isClient, isSubUser
 * - Home page resolution: userHomePage
 * - Permission checks: permitted, hasPermission, hasAllPermissions, hasAnyPermission
 * - Role checks: hasRole
 * - Compound checks: canPerformAction
 * - Email verification: verified
 */

import { describe, it, expect } from 'vitest'
import {
  verified,
  isSuperAdmin,
  isCustomer,
  isClient,
  isSubUser,
  userHomePage,
  permitted,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isAdmin,
  isModerator,
  canPerformAction,
} from '@/lib/utils/permissions'
import type { User, UserRole, PermissionObject } from '@/types/entities/user'

// ---- Test Data Factories ----

function createPermission(slug: string): PermissionObject {
  return { id: (Math.random() * 1000) | 0, slug, name: slug }
}

function createRole(overrides: Partial<UserRole> = {}): UserRole {
  return {
    name: 'Client',
    home_page: '/qrcodes',
    super_admin: false,
    permissions: [],
    ...overrides,
  }
}

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    email_verified_at: '2024-01-01T00:00:00Z',
    roles: [createRole()],
    ...overrides,
  }
}

// ---- Tests ----

describe('verified', () => {
  it('should return true when email_verified_at is set', () => {
    const user = createUser({ email_verified_at: '2024-01-01' })
    expect(verified(user)).toBe(true)
  })

  it('should return false when email_verified_at is null', () => {
    const user = createUser({ email_verified_at: null })
    expect(verified(user)).toBe(false)
  })

  it('should return false when email_verified_at is undefined', () => {
    const user = createUser({ email_verified_at: undefined })
    expect(verified(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(verified(null)).toBe(false)
  })

  it('should return false for undefined user', () => {
    expect(verified(undefined)).toBe(false)
  })
})

describe('isSuperAdmin', () => {
  it('should return true when user has a role with super_admin=true', () => {
    const user = createUser({
      roles: [createRole({ super_admin: true, name: 'Admin' })],
    })
    expect(isSuperAdmin(user)).toBe(true)
  })

  it('should return true when super_admin is 1 (number truthy)', () => {
    const user = createUser({
      roles: [createRole({ super_admin: 1 as unknown as boolean })],
    })
    expect(isSuperAdmin(user)).toBe(true)
  })

  it('should return false when super_admin is false', () => {
    const user = createUser({
      roles: [createRole({ super_admin: false })],
    })
    expect(isSuperAdmin(user)).toBe(false)
  })

  it('should return false when super_admin is 0', () => {
    const user = createUser({
      roles: [createRole({ super_admin: 0 as unknown as boolean })],
    })
    expect(isSuperAdmin(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(isSuperAdmin(null)).toBe(false)
  })

  it('should return false when user has no roles', () => {
    const user = createUser({ roles: [] })
    expect(isSuperAdmin(user)).toBe(false)
  })
})

describe('isCustomer', () => {
  it('should return true for Client role', () => {
    const user = createUser({ roles: [createRole({ name: 'Client' })] })
    expect(isCustomer(user)).toBe(true)
  })

  it('should return true for Sub User role', () => {
    const user = createUser({ roles: [createRole({ name: 'Sub User' })] })
    expect(isCustomer(user)).toBe(true)
  })

  it('should return false for Admin role', () => {
    const user = createUser({ roles: [createRole({ name: 'Admin' })] })
    expect(isCustomer(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(isCustomer(null)).toBe(false)
  })

  it('should check first role only', () => {
    const user = createUser({
      roles: [createRole({ name: 'Admin' }), createRole({ name: 'Client' })],
    })
    expect(isCustomer(user)).toBe(false)
  })
})

describe('isClient', () => {
  it('should return true when any role is named Client', () => {
    const user = createUser({
      roles: [createRole({ name: 'Admin' }), createRole({ name: 'Client' })],
    })
    expect(isClient(user)).toBe(true)
  })

  it('should return false when no role is named Client', () => {
    const user = createUser({ roles: [createRole({ name: 'Sub User' })] })
    expect(isClient(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(isClient(null)).toBe(false)
  })
})

describe('isSubUser', () => {
  it('should return true when is_sub flag is true', () => {
    const user = createUser({ is_sub: true })
    expect(isSubUser(user)).toBe(true)
  })

  it('should return false when is_sub is false', () => {
    const user = createUser({ is_sub: false })
    expect(isSubUser(user)).toBe(false)
  })

  it('should return false when is_sub is undefined', () => {
    const user = createUser()
    expect(isSubUser(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(isSubUser(null)).toBe(false)
  })
})

describe('userHomePage', () => {
  it('should return the first role home_page for regular user', () => {
    const user = createUser({
      roles: [createRole({ home_page: '/qrcodes' })],
    })
    expect(userHomePage(user)).toBe('/qrcodes')
  })

  it('should return parent_user home_page for sub user', () => {
    const user = createUser({
      is_sub: true,
      parent_user: {
        id: 2,
        name: 'Parent',
        roles: [createRole({ home_page: '/parent-dashboard' })],
      },
    })
    expect(userHomePage(user)).toBe('/parent-dashboard')
  })

  it('should strip /dashboard prefix from legacy paths', () => {
    const user = createUser({
      roles: [createRole({ home_page: '/dashboard/qrcodes' })],
    })
    expect(userHomePage(user)).toBe('/qrcodes')
  })

  it('should fallback to /qrcodes/new when no home page set', () => {
    const user = createUser({
      roles: [createRole({ home_page: '' })],
    })
    expect(userHomePage(user)).toBe('/qrcodes/new')
  })

  it('should return /qrcodes/new for null user', () => {
    expect(userHomePage(null)).toBe('/qrcodes/new')
  })

  it('should return /qrcodes/new for undefined user', () => {
    expect(userHomePage(undefined)).toBe('/qrcodes/new')
  })

  it('should use own role when sub user has no parent roles', () => {
    const user = createUser({
      is_sub: true,
      parent_user: { id: 2, name: 'Parent', roles: [] },
      roles: [createRole({ home_page: '/my-page' })],
    })
    expect(userHomePage(user)).toBe('/my-page')
  })
})

describe('permitted', () => {
  it('should return true for empty/null slug (public route)', () => {
    const user = createUser()
    expect(permitted(user, '')).toBe(true)
    expect(permitted(user, null)).toBe(true)
    expect(permitted(user, undefined)).toBe(true)
    expect(permitted(user, '   ')).toBe(true)
  })

  it('should return false when user has no roles', () => {
    const user = createUser({ roles: [] })
    expect(permitted(user, 'some.permission')).toBe(false)
  })

  it('should return true for super admin regardless of permission', () => {
    const user = createUser({
      roles: [createRole({ super_admin: true, permissions: [] })],
    })
    expect(permitted(user, 'any.permission')).toBe(true)
    expect(permitted(user, 'another.permission')).toBe(true)
  })

  it('should return false when email is not verified', () => {
    const user = createUser({
      email_verified_at: null,
      roles: [createRole({ permissions: [createPermission('test.perm')] })],
    })
    expect(permitted(user, 'test.perm')).toBe(false)
  })

  it('should return true when user has matching permission object', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('qr.create')] })],
    })
    expect(permitted(user, 'qr.create')).toBe(true)
  })

  it('should return false when user lacks the permission', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('qr.view')] })],
    })
    expect(permitted(user, 'qr.delete')).toBe(false)
  })

  it('should check permissions across all roles', () => {
    const user = createUser({
      roles: [
        createRole({ permissions: [createPermission('qr.view')] }),
        createRole({ permissions: [createPermission('qr.edit')] }),
      ],
    })
    expect(permitted(user, 'qr.view')).toBe(true)
    expect(permitted(user, 'qr.edit')).toBe(true)
  })

  it('should handle string permissions (legacy format)', () => {
    const user = createUser({
      roles: [createRole({ permissions: ['legacy.perm'] as unknown as PermissionObject[] })],
    })
    expect(permitted(user, 'legacy.perm')).toBe(true)
  })

  it('should return false for null user', () => {
    expect(permitted(null, 'some.permission')).toBe(false)
  })
})

describe('hasPermission', () => {
  it('should delegate to permitted()', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('user.list')] })],
    })
    expect(hasPermission(user, 'user.list')).toBe(true)
    expect(hasPermission(user, 'user.delete')).toBe(false)
  })
})

describe('hasAllPermissions', () => {
  it('should return true when user has all listed permissions', () => {
    const user = createUser({
      roles: [
        createRole({
          permissions: [
            createPermission('qr.create'),
            createPermission('qr.view'),
            createPermission('qr.edit'),
          ],
        }),
      ],
    })
    expect(hasAllPermissions(user, ['qr.create', 'qr.view', 'qr.edit'])).toBe(true)
  })

  it('should return false when user is missing one permission', () => {
    const user = createUser({
      roles: [
        createRole({
          permissions: [createPermission('qr.create'), createPermission('qr.view')],
        }),
      ],
    })
    expect(hasAllPermissions(user, ['qr.create', 'qr.view', 'qr.delete'])).toBe(false)
  })

  it('should return true for empty permissions array', () => {
    const user = createUser()
    expect(hasAllPermissions(user, [])).toBe(true)
  })
})

describe('hasAnyPermission', () => {
  it('should return true when user has at least one permission', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('qr.view')] })],
    })
    expect(hasAnyPermission(user, ['qr.view', 'qr.delete'])).toBe(true)
  })

  it('should return false when user has none of the listed permissions', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('qr.view')] })],
    })
    expect(hasAnyPermission(user, ['qr.create', 'qr.delete'])).toBe(false)
  })

  it('should return false for empty permissions array', () => {
    const user = createUser()
    expect(hasAnyPermission(user, [])).toBe(false)
  })
})

describe('hasRole', () => {
  it('should return true when user has the role', () => {
    const user = createUser({ roles: [createRole({ name: 'Client' })] })
    expect(hasRole(user, 'Client')).toBe(true)
  })

  it('should return false when user does not have the role', () => {
    const user = createUser({ roles: [createRole({ name: 'Client' })] })
    expect(hasRole(user, 'Admin')).toBe(false)
  })

  it('should return false for null user', () => {
    expect(hasRole(null, 'Client')).toBe(false)
  })

  it('should match role name exactly (case-sensitive)', () => {
    const user = createUser({ roles: [createRole({ name: 'Client' })] })
    expect(hasRole(user, 'client')).toBe(false)
  })
})

describe('isAdmin (deprecated wrapper)', () => {
  it('should delegate to isSuperAdmin', () => {
    const admin = createUser({
      roles: [createRole({ super_admin: true })],
    })
    const nonAdmin = createUser({
      roles: [createRole({ super_admin: false })],
    })
    expect(isAdmin(admin)).toBe(true)
    expect(isAdmin(nonAdmin)).toBe(false)
  })
})

describe('isModerator', () => {
  it('should return true for moderator role', () => {
    const user = createUser({ roles: [createRole({ name: 'moderator' })] })
    expect(isModerator(user)).toBe(true)
  })

  it('should return true for admin role', () => {
    const user = createUser({ roles: [createRole({ name: 'admin' })] })
    expect(isModerator(user)).toBe(true)
  })

  it('should return false for client role', () => {
    const user = createUser({ roles: [createRole({ name: 'Client' })] })
    expect(isModerator(user)).toBe(false)
  })

  it('should return false for null user', () => {
    expect(isModerator(null)).toBe(false)
  })
})

describe('canPerformAction', () => {
  it('should return true for admin user regardless of permission', () => {
    const admin = createUser({
      roles: [createRole({ super_admin: true })],
    })
    expect(canPerformAction(admin, 'qr.delete', '999')).toBe(true)
  })

  it('should allow action when user has permission and owns resource', () => {
    const user = createUser({
      id: 42,
      roles: [createRole({ permissions: [createPermission('qr.edit')] })],
    })
    expect(canPerformAction(user, 'qr.edit', '42')).toBe(true)
  })

  it('should deny action when user has permission but does not own resource', () => {
    const user = createUser({
      id: 42,
      roles: [createRole({ permissions: [createPermission('qr.edit')] })],
    })
    expect(canPerformAction(user, 'qr.edit', '999')).toBe(false)
  })

  it('should deny action when user lacks permission', () => {
    const user = createUser({
      id: 42,
      roles: [createRole({ permissions: [] })],
    })
    expect(canPerformAction(user, 'qr.delete')).toBe(false)
  })

  it('should allow action when permission granted and no resource owner check', () => {
    const user = createUser({
      roles: [createRole({ permissions: [createPermission('qr.list')] })],
    })
    expect(canPerformAction(user, 'qr.list')).toBe(true)
  })

  it('should return false for null user', () => {
    expect(canPerformAction(null, 'anything')).toBe(false)
  })
})

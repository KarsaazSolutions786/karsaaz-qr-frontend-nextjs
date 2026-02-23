/**
 * Permission as returned by the Laravel backend
 * Can be either a string slug (legacy) or a full permission object.
 */
export type PermissionSlug = string // e.g. 'user.list-all', 'role.store'

export interface PermissionObject {
  id: number
  slug: string
  name: string
}

// Backward-compat alias
export type Permission = PermissionSlug

export type Role = 'admin' | 'user' | 'moderator'

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial' | 'none'

/**
 * Role as returned by the Laravel API.
 * super_admin is a boolean (or 0/1) — when truthy, ALL permission checks are bypassed.
 */
export interface UserRole {
  id?: number
  name: string // e.g. 'Client', 'Sub User', 'Admin'
  home_page: string // e.g. '/qrcodes', '/dashboard/system/status'
  super_admin: boolean | number // truthy = bypass all permissions
  read_only?: boolean | number // cannot be edited/deleted in UI
  permissions: PermissionObject[] // full permission objects from API
  permission_count?: number
  user_count?: number
  created_at?: string
  updated_at?: string
}

// Subscription as returned by the API
export interface UserSubscription {
  id?: number
  name?: string
  stripe_id?: string
  stripe_status?: string
  stripe_price?: string
  ends_at?: string | null
  [key: string]: unknown
}

export interface User {
  id: number | string
  email: string
  name?: string
  email_verified_at?: string | null
  /**
   * is_sub=true indicates this is a Sub User account managed by a parent user.
   * Sub users use parent_user.roles[0].home_page for navigation.
   */
  is_sub?: boolean
  roles?: UserRole[]
  subscriptions?: UserSubscription[]
  avatar?: string
  created_at?: string
  updated_at?: string
  // Admin-facing backend fields
  mobile_number?: string
  qrcodes_count?: number
  scans?: number
  account_balance?: number
  /**
   * For sub-users: the parent account owner.
   * Sub users navigate to parent_user.roles[0].home_page instead of their own.
   */
  parent_user?: { id: number | string; name: string; roles?: UserRole[] } | null
  /** Current subscription plan populated by backend */
  plan?: {
    id?: string
    name: string
    qr_codes_limit?: number | null
    scans_limit?: number | null
  }
  /** Transactions loaded by backend for admin user list */
  transactions?: { id: number; user_id?: number; status?: string; amount?: number }[]
  // Computed/convenience properties (set by client-side logic)
  role?: string
  permissions?: PermissionSlug[]
  subscriptionStatus?: SubscriptionStatus
  emailVerified?: boolean
  passwordlessEnabled?: boolean
  createdAt?: string
  lastLoginAt?: string
}

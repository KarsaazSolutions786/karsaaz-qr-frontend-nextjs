export type Permission = string // e.g., 'qrcode.list', 'qrcode.create', 'admin.users.manage'

export type Role = 'admin' | 'user' | 'moderator'

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial' | 'none'

// Role as returned by the Laravel API
export interface UserRole {
  id?: number
  name: string
  home_page: string
  super_admin: number // 0 or 1
  permissions: Permission[]
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
  is_sub?: boolean
  roles?: UserRole[]
  subscriptions?: UserSubscription[]
  avatar?: string
  created_at?: string
  updated_at?: string
  // Computed/convenience properties (set by client-side logic)
  role?: string
  permissions?: Permission[]
  subscriptionStatus?: SubscriptionStatus
  emailVerified?: boolean
  passwordlessEnabled?: boolean
  createdAt?: string
  lastLoginAt?: string
}

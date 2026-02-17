export type Role = 'admin' | 'user' | 'moderator'

export type Permission = string // e.g., 'qrcode.list', 'qrcode.create', 'admin.users.manage'

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial' | 'none'

export interface User {
  id: string // UUID
  email: string // Email address (unique)
  name?: string // Full name (optional)
  role: Role // User role
  permissions: Permission[] // Granular permissions
  subscriptionStatus: SubscriptionStatus // Subscription status
  emailVerified: boolean // Email verification status
  passwordlessEnabled: boolean // Passwordless auth preference
  createdAt: string // ISO 8601 timestamp
  lastLoginAt?: string // ISO 8601 timestamp (optional)
  avatar?: string // Avatar URL (optional)
}

import { Role, Permission } from './user'

export type { Role, Permission }

export interface RoleDefinition {
  name: Role
  displayName: string
  description: string
  permissions: Permission[]
}

export const PERMISSIONS = {
  // QR Codes
  QRCODE_LIST: 'qrcode.list',
  QRCODE_CREATE: 'qrcode.create',
  QRCODE_UPDATE: 'qrcode.update',
  QRCODE_DELETE: 'qrcode.delete',
  QRCODE_STATS: 'qrcode.stats',

  // Subscriptions
  SUBSCRIPTION_VIEW: 'subscription.view',
  SUBSCRIPTION_MANAGE: 'subscription.manage',

  // Domains
  DOMAIN_LIST: 'domain.list',
  DOMAIN_CREATE: 'domain.create',
  DOMAIN_UPDATE: 'domain.update',
  DOMAIN_DELETE: 'domain.delete',

  // Admin - Users
  ADMIN_USERS_LIST: 'admin.users.list',
  ADMIN_USERS_CREATE: 'admin.users.create',
  ADMIN_USERS_UPDATE: 'admin.users.update',
  ADMIN_USERS_DELETE: 'admin.users.delete',

  // Admin - Content
  ADMIN_CONTENT_MANAGE: 'admin.content.manage',
  ADMIN_BLOG_MANAGE: 'admin.blog.manage',

  // Support
  SUPPORT_TICKET_CREATE: 'support.ticket.create',
  SUPPORT_TICKET_VIEW: 'support.ticket.view',
  SUPPORT_TICKET_RESPOND: 'support.ticket.respond',
  SUPPORT_TICKET_MANAGE_ALL: 'support.ticket.manage.all', // Admin only

  // Billing
  BILLING_VIEW: 'billing.view',
  BILLING_UPDATE: 'billing.update',

  // Referrals
  REFERRAL_VIEW: 'referral.view',
  REFERRAL_MANAGE: 'referral.manage',
} as const

export const ROLES: RoleDefinition[] = [
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access',
    permissions: Object.values(PERMISSIONS),
  },
  {
    name: 'user',
    displayName: 'User',
    description: 'Standard user access',
    permissions: [
      PERMISSIONS.QRCODE_LIST,
      PERMISSIONS.QRCODE_CREATE,
      PERMISSIONS.QRCODE_UPDATE,
      PERMISSIONS.QRCODE_DELETE,
      PERMISSIONS.QRCODE_STATS,
      PERMISSIONS.SUBSCRIPTION_VIEW,
      PERMISSIONS.SUBSCRIPTION_MANAGE,
      PERMISSIONS.DOMAIN_LIST,
      PERMISSIONS.DOMAIN_CREATE,
      PERMISSIONS.DOMAIN_UPDATE,
      PERMISSIONS.DOMAIN_DELETE,
      PERMISSIONS.SUPPORT_TICKET_CREATE,
      PERMISSIONS.SUPPORT_TICKET_VIEW,
      PERMISSIONS.BILLING_VIEW,
      PERMISSIONS.BILLING_UPDATE,
      PERMISSIONS.REFERRAL_VIEW,
      PERMISSIONS.REFERRAL_MANAGE,
    ],
  },
  {
    name: 'moderator',
    displayName: 'Moderator',
    description: 'Support and content management access',
    permissions: [
      PERMISSIONS.QRCODE_LIST,
      PERMISSIONS.QRCODE_CREATE,
      PERMISSIONS.QRCODE_UPDATE,
      PERMISSIONS.QRCODE_DELETE,
      PERMISSIONS.QRCODE_STATS,
      PERMISSIONS.SUPPORT_TICKET_CREATE,
      PERMISSIONS.SUPPORT_TICKET_VIEW,
      PERMISSIONS.SUPPORT_TICKET_RESPOND,
      PERMISSIONS.SUPPORT_TICKET_MANAGE_ALL,
      PERMISSIONS.ADMIN_CONTENT_MANAGE,
      PERMISSIONS.ADMIN_BLOG_MANAGE,
    ],
  },
]

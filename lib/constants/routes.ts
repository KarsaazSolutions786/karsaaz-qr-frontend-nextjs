/**
 * Application Routes
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,

  // Auth routes
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Dashboard routes
  DASHBOARD: '/dashboard',
  ACCOUNT: '/account',

  // QR Codes
  QRCODES: {
    LIST: '/qrcodes',
    NEW: '/qrcodes/new',
    DETAIL: (id: string) => `/qrcodes/${id}`,
    EDIT: (id: string) => `/qrcodes/${id}/edit`,
    STATS: (id: string) => `/qrcodes/${id}/stats`,
    BULK_CREATE: '/qrcodes/bulk-create',
  },

  // Subscriptions
  SUBSCRIPTIONS: '/subscriptions',
  CHECKOUT: '/checkout',

  // Domains
  DOMAINS: '/domains',

  // Billing
  BILLING: '/billing',

  // Support
  SUPPORT: {
    LIST: '/support',
    TICKET: (id: string) => `/support/${id}`,
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    CONTENT: {
      BLOG: '/admin/content/blog',
      PAGES: '/admin/content/pages',
    },
    SYSTEM: '/admin/system',
  },

  // Referrals
  REFERRALS: '/referrals',
} as const

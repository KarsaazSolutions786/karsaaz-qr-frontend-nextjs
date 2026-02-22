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
    TEMPLATES: '/qrcode-templates',
    ARCHIVED: '/qrcodes?archived=true',
  },

  // Cloud Storage
  CLOUD_STORAGE: '/cloud-storage',

  // Connections
  CONNECTIONS: '/connections',

  // Users
  USERS: {
    ALL: '/users',
    PAYING: '/users/paying',
    NON_PAYING: '/users/non-paying',
    ROLES: '/users/roles',
  },

  // Finance
  FINANCE: {
    PLANS: '/plans',
    SUBSCRIPTIONS: '/subscriptions',
    BILLING: '/billing',
    TRANSACTIONS: '/transactions',
    TRANSACTION_DETAIL: (id: string | number) => `/transactions/${id}`,
    PAYMENT_PROCESSORS: '/payment-processors',
    PAYMENT_GATEWAYS: '/payment-gateways',
    PAYMENT_METHODS: '/payment-methods',
    CURRENCIES: '/currencies',
    ACCOUNT_CREDITS: '/account-credits',
    CHECKOUT_ACCOUNT_CREDIT: '/checkout-account-credit',
  },

  // Content
  CONTENT: {
    BLOG_POSTS: '/blog-posts',
    CONTENT_BLOCKS: '/content-blocks',
    TRANSLATIONS: '/translations',
    CUSTOM_CODE: '/custom-code',
    PAGES: '/pages',
    BIOLINKS: '/biolinks',
  },

  // Contacts
  CONTACTS: {
    CONTACT_FORM: '/contact-form',
    LEAD_FORMS: '/lead-forms',
  },

  // Plugins
  PLUGINS: {
    AVAILABLE: '/plugins/available',
    INSTALLED: '/plugins/installed',
  },

  // System
  SYSTEM: {
    STATUS: '/system/status',
    SETTINGS: '/system/settings',
    LOGS: '/system/logs',
    CACHE: '/system/cache',
    NOTIFICATIONS: '/system/notifications',
    SMS_PORTALS: '/system/sms-portals',
    AUTH_WORKFLOW: '/system/auth-workflow',
    ABUSE_REPORTS: '/system/abuse-reports',
    DOMAINS: '/system/domains',
  },

  // Subscriptions (legacy alias)
  SUBSCRIPTIONS: '/subscriptions',
  CHECKOUT: '/checkout',

  // Billing (legacy alias)
  BILLING: '/billing',

  // Support
  SUPPORT: {
    LIST: '/support-tickets',
    NEW: '/support-tickets/new',
    TICKET: (id: string | number) => `/support-tickets/${id}`,
  },

  // Referrals
  REFERRALS: {
    DASHBOARD: '/referral',
    WITHDRAWALS: '/referral/withdrawals',
  },

  // Payment Gateways
  PAYMENT_GATEWAYS: {
    LIST: '/payment-gateways',
    NEW: '/payment-gateways/new',
    EDIT: (id: string | number) => `/payment-gateways/${id}`,
  },

  // Payment Methods
  PAYMENT_METHODS: '/payment-methods',

  // Domains
  DOMAINS: {
    LIST: '/domains',
    NEW: '/domains/new',
    EDIT: (id: string | number) => `/domains/${id}`,
  },

  // Installation
  INSTALL: '/install',

  // QR Redirect
  QR_REDIRECT: (slug: string) => `/s/${slug}`,
} as const

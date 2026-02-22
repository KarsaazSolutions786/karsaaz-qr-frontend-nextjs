/**
 * Query Key Factory
 * 
 * Standardized query keys for React Query
 * Pattern: ['resource', id, 'sub-resource']
 */

export const queryKeys = {
  // Auth
  auth: {
    currentUser: () => ['auth', 'current-user'] as const,
  },

  // QR Codes
  qrcodes: {
    all: () => ['qrcodes'] as const,
    list: (filters?: Record<string, unknown>) => ['qrcodes', 'list', filters] as const,
    detail: (id: string) => ['qrcodes', id] as const,
    stats: (id: string) => ['qrcodes', id, 'stats'] as const,
    scans: (id: string, dateRange?: { start: string; end: string }) =>
      ['qrcodes', id, 'scans', dateRange] as const,
  },

  // Subscriptions
  subscriptions: {
    all: () => ['subscriptions'] as const,
    plans: () => ['subscriptions', 'plans'] as const,
    current: () => ['subscriptions', 'current'] as const,
    transactions: () => ['subscriptions', 'transactions'] as const,
  },

  // Admin Subscriptions
  adminSubscriptions: {
    all: () => ['admin-subscriptions'] as const,
    list: (filters?: Record<string, unknown>) => ['admin-subscriptions', 'list', filters] as const,
    detail: (id: number) => ['admin-subscriptions', id] as const,
    statuses: () => ['admin-subscriptions', 'statuses'] as const,
  },

  // System Configs
  systemConfigs: {
    byKeys: (keys: string[]) => ['system-configs', keys.sort().join(',')] as const,
  },

  // Domains
  domains: {
    all: () => ['domains'] as const,
    list: () => ['domains', 'list'] as const,
    detail: (id: string) => ['domains', id] as const,
  },

  // Users (Admin)
  users: {
    all: () => ['users'] as const,
    list: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', id] as const,
  },

  // Support
  support: {
    all: () => ['support'] as const,
    tickets: () => ['support', 'tickets'] as const,
    ticket: (id: string) => ['support', 'tickets', id] as const,
  },

  // Content
  content: {
    blogPosts: () => ['content', 'blog'] as const,
    blogPost: (slug: string) => ['content', 'blog', slug] as const,
    pages: () => ['content', 'pages'] as const,
  },

  // Referrals
  referrals: {
    all: () => ['referrals'] as const,
    stats: () => ['referrals', 'stats'] as const,
  },

  // Lead Forms
  leadForms: {
    all: () => ['lead-forms'] as const,
    list: (filters?: Record<string, unknown>) => ['lead-forms', 'list', filters] as const,
    detail: (id: number) => ['lead-forms', id] as const,
    responses: (formId?: number, params?: Record<string, unknown>) =>
      formId ? ['lead-forms', formId, 'responses', params] as const : ['lead-forms', 'responses'] as const,
  },

  // Billing
  billing: {
    all: () => ['billing'] as const,
    invoices: () => ['billing', 'invoices'] as const,
    invoice: (id: string) => ['billing', 'invoices', id] as const,
    paymentMethods: () => ['billing', 'payment-methods'] as const,
    paymentProcessors: () => ['billing', 'payment-processors'] as const,
  },

  // Blog Posts
  blogPosts: {
    all: () => ['blog-posts'] as const,
    list: (filters?: Record<string, unknown>) => ['blog-posts', 'list', filters] as const,
    detail: (id: number) => ['blog-posts', id] as const,
  },

  // Content Blocks
  contentBlocks: {
    all: () => ['content-blocks'] as const,
    list: (filters?: Record<string, unknown>) => ['content-blocks', 'list', filters] as const,
    detail: (id: number) => ['content-blocks', id] as const,
  },

  // Biolinks
  biolinks: {
    all: ['biolinks'] as const,
    list: (filters?: Record<string, unknown>) => ['biolinks', 'list', filters] as const,
    detail: (id: number) => ['biolinks', id] as const,
    bySlug: (slug: string) => ['biolinks', 'slug', slug] as const,
  },

  // Plans (Subscription Plans - Admin)
  plans: {
    all: () => ['plans'] as const,
    list: (filters?: Record<string, unknown>) => ['plans', 'list', filters] as const,
    detail: (id: number) => ['plans', id] as const,
  },

  // Transactions (Admin)
  transactions: {
    all: () => ['transactions'] as const,
    list: (filters?: Record<string, unknown>) => ['transactions', 'list', filters] as const,
    detail: (id: number) => ['transactions', id] as const,
  },

  // Currencies
  currencies: {
    all: () => ['currencies'] as const,
    list: (filters?: Record<string, unknown>) => ['currencies', 'list', filters] as const,
    detail: (id: number) => ['currencies', id] as const,
  },

  // Roles
  roles: {
    all: () => ['roles'] as const,
    list: (filters?: Record<string, unknown>) => ['roles', 'list', filters] as const,
    detail: (id: number) => ['roles', id] as const,
    permissions: () => ['roles', 'permissions'] as const,
  },

  // Contacts
  contacts: {
    all: () => ['contacts'] as const,
    list: (filters?: Record<string, unknown>) => ['contacts', 'list', filters] as const,
    detail: (id: number) => ['contacts', id] as const,
  },

  // Pages
  pages: {
    all: () => ['pages'] as const,
    list: (filters?: Record<string, unknown>) => ['pages', 'list', filters] as const,
    detail: (id: number) => ['pages', id] as const,
  },

  // Translations
  translations: {
    all: () => ['translations'] as const,
    list: (filters?: Record<string, unknown>) => ['translations', 'list', filters] as const,
    detail: (id: number) => ['translations', id] as const,
  },

  // Custom Codes
  customCodes: {
    all: () => ['custom-codes'] as const,
    list: (filters?: Record<string, unknown>) => ['custom-codes', 'list', filters] as const,
    detail: (id: number) => ['custom-codes', id] as const,
    positions: () => ['custom-codes', 'positions'] as const,
  },

  // Dynamic Biolink Blocks
  dynamicBiolinkBlocks: {
    all: () => ['dynamic-biolink-blocks'] as const,
    list: (filters?: Record<string, unknown>) => ['dynamic-biolink-blocks', 'list', filters] as const,
    detail: (id: number) => ['dynamic-biolink-blocks', id] as const,
  },

  // Folders
  folders: {
    all: () => ['folders'] as const,
    list: (params?: Record<string, unknown>) => ['folders', 'list', params] as const,
    tree: () => ['folders', 'tree'] as const,
    detail: (id: string) => ['folders', id] as const,
  },

  // Cloud Storage
  cloudStorage: {
    connections: () => ['cloud-storage', 'connections'] as const,
    connection: (id: string) => ['cloud-storage', 'connections', id] as const,
    backupJobs: () => ['cloud-storage', 'backup-jobs'] as const,
    backupJob: (id: string) => ['cloud-storage', 'backup-jobs', id] as const,
  },

  // Banner Settings
  bannerSettings: {
    all: () => ['banner-settings'] as const,
  },

  // Passwordless Auth
  passwordless: {
    status: () => ['passwordless', 'status'] as const,
    preference: () => ['passwordless', 'preference'] as const,
  },
}

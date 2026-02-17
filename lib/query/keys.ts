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
}

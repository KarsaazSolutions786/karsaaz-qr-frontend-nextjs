import apiClient from '@/lib/api/client'

export interface Organization {
  id: number
  name: string
  slug: string
  status: 'active' | 'suspended' | 'trial'
  website?: string
  plan?: string
  owner_user_id?: number
  credits: {
    balance: number
    lifetime_purchased: number
    lifetime_spent: number
  }
}

export interface OrganizationMember {
  id: number
  user_id: number
  role: 'owner' | 'admin' | 'member' | 'viewer'
  invited_at: string
  joined_at?: string
  user: { id: number; name: string; email: string }
}

export interface ApiKey {
  id: number
  name: string
  prefix: string
  scopes: string[]
  rate_limit_per_minute: number
  is_active: boolean
  last_used_at?: string
  expires_at?: string
  created_at: string
  // Only present on creation
  token?: string
  _warning?: string
}

export interface UsageSummary {
  period: string
  total_requests: number
  total_credits: number
  avg_response_ms: number
  success_count: number
  error_count: number
  daily_trend: Array<{ date: string; requests: number; credits: number }>
}

export interface UsageBreakdown {
  period: string
  endpoints: Array<{
    endpoint: string
    http_method: string
    calls: number
    credits_consumed: number
    avg_response_ms: number
    errors: number
  }>
}

export interface CreditPackage {
  id: number
  name: string
  credits: number
  price_usd: number
  is_active: boolean
}

// ─── Organizations ────────────────────────────────────────────────────────────

export const organizationAPI = {
  list: () => apiClient.get<{ data: Organization[] }>('/organization'),

  create: (payload: { name: string; website?: string }) =>
    apiClient.post<{
      data: Organization
      portal_credentials?: { email: string; password: string; note?: string }
    }>('/organization', payload),

  get: (orgId: number) => apiClient.get<{ data: Organization }>(`/organization/${orgId}`),

  update: (orgId: number, payload: Partial<Organization>) =>
    apiClient.patch<{ data: Organization }>(`/organization/${orgId}`, payload),

  delete: (orgId: number) => apiClient.delete(`/organization/${orgId}`),

  // Members
  getMembers: (orgId: number) =>
    apiClient.get<{ data: OrganizationMember[] }>(`/organization/${orgId}/members`),

  inviteMember: (orgId: number, email: string, role: string) =>
    apiClient.post<{ data: OrganizationMember }>(`/organization/${orgId}/members`, { email, role }),

  updateMember: (orgId: number, memberId: number, role: string) =>
    apiClient.put(`/organization/${orgId}/members/${memberId}`, { role }),

  removeMember: (orgId: number, memberId: number) =>
    apiClient.delete(`/organization/${orgId}/members/${memberId}`),

  sendInvite: (orgId: number, contactEmail?: string) =>
    apiClient.post<{
      data: { invite_url: string; expires_at: string; org_name: string; org_slug: string }
    }>(`/organization/${orgId}/send-invite`, contactEmail ? { contact_email: contactEmail } : {}),
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export const apiKeyAPI = {
  list: (orgId: number) =>
    apiClient.get<{
      data: ApiKey[]
      usage: {
        monthly_requests_used: number
        monthly_requests_limit: number
        rate_limit_per_minute: number
      }
    }>(`/organization/${orgId}/api-keys`),

  create: (
    orgId: number,
    payload: {
      name: string
      scopes?: string[]
      rate_limit_per_minute?: number
      expires_at?: string
    }
  ) => apiClient.post<{ data: ApiKey }>(`/organization/${orgId}/api-keys`, payload),

  get: (orgId: number, keyId: number) =>
    apiClient.get<{ data: ApiKey }>(`/organization/${orgId}/api-keys/${keyId}`),

  update: (orgId: number, keyId: number, payload: Partial<ApiKey>) =>
    apiClient.patch<{ data: ApiKey }>(`/organization/${orgId}/api-keys/${keyId}`, payload),

  revoke: (orgId: number, keyId: number) =>
    apiClient.delete(`/organization/${orgId}/api-keys/${keyId}`),
}

// ─── Usage (management API — Sanctum session auth) ────────────────────────────

export const orgUsageAPI = {
  summary: (orgId: number, period = '30d') =>
    apiClient.get<{ data: UsageSummary }>(`/organization/${orgId}/usage?period=${period}`),

  breakdown: (orgId: number, period = '30d') =>
    apiClient.get<{ data: UsageBreakdown }>(
      `/organization/${orgId}/usage/breakdown?period=${period}`
    ),

  credits: (orgId: number) =>
    apiClient.get<{
      data: { balance: number; lifetime_purchased: number; lifetime_spent: number }
    }>(`/organization/${orgId}/credits`),
}

// ─── Portal Credentials (admin) ──────────────────────────────────────────────

export interface PortalCredentials {
  portal_email: string
  portal_password?: string // only present after reset
  note?: string
}

export const orgPortalAdminAPI = {
  getCredentials: (orgId: number) =>
    apiClient.get<{ data: PortalCredentials }>(`/organization/${orgId}/portal/credentials`),

  resetPassword: (orgId: number) =>
    apiClient.post<{ data: PortalCredentials }>(`/organization/${orgId}/portal/reset-password`),
}

// ─── Billing / Credits ───────────────────────────────────────────────────────

export const creditPackageAPI = {
  list: (orgId: number) =>
    apiClient.get<{ data: CreditPackage[] }>(`/organization/${orgId}/credits/packages`),

  purchase: (orgId: number, packageId: number) =>
    apiClient.post<{ data: { checkout_url: string; session_id: string } }>(
      `/organization/${orgId}/credits/purchase`,
      { package_id: packageId }
    ),
}

// ─── Org Plans (admin CRUD + assign) ─────────────────────────────────────────

export interface OrgPlan {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  monthly_api_calls: number // -1 = unlimited
  monthly_qr_creates: number // -1 = unlimited
  rate_limit_per_minute: number
  included_tokens?: number
  features?: string[]
  is_active: boolean
  is_popular: boolean
  /** True for a bespoke plan scoped to exactly one organization_id (not in the shared catalog). */
  is_custom: boolean
  /** Non-null only for custom plans -- the single organization this plan is private to. */
  organization_id: number | null
  sort_order: number
  created_at: string
}

export const orgPlanAPI = {
  /** Admin: full catalog + all custom plans (optionally scoped with { organization_id } to review one org's plans). Org-portal: shared catalog + own org's custom plans only. */
  list: (params?: { organization_id?: number }) =>
    apiClient.get<{ data: OrgPlan[] }>('/org-plans', { params }),

  create: (payload: Omit<OrgPlan, 'id' | 'slug' | 'created_at' | 'is_custom'>) =>
    apiClient.post<{ data: OrgPlan }>('/org-plans', payload),

  update: (planId: number, payload: Partial<OrgPlan>) =>
    apiClient.patch<{ data: OrgPlan }>(`/org-plans/${planId}`, payload),

  delete: (planId: number) => apiClient.delete(`/org-plans/${planId}`),

  assignToOrg: (orgId: number, orgPlanId: number | null) =>
    apiClient.post<{ data: { org_plan_id: number | null } }>(`/organization/${orgId}/plan`, {
      org_plan_id: orgPlanId,
    }),
}

// ─── Org Portal Plans (portal-auth) ──────────────────────────────────────────

export const orgPortalPlansAPI = {
  get: () =>
    apiClient.get<{ data: { current_plan: OrgPlan | null; available_plans: OrgPlan[] } }>(
      '/org-portal/plans',
      {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('org_portal_token') : ''}`,
        },
      }
    ),
}

// ─── Admin Organization Management (super admin) ─────────────────────────────

export interface AdminOrganizationListItem {
  id: number
  name: string
  slug: string
  status: 'pending' | 'trial' | 'active' | 'suspended' | 'closed'
  suspended_at?: string | null
  suspension_reason?: string | null
  org_plan_id: number | null
  org_plan?: OrgPlan | null
  created_at: string
}

export interface AdminOrganizationDetail {
  organization: AdminOrganizationListItem & {
    owner: { id: number; name: string; email: string }
    org_plan: OrgPlan | null
    credits: { balance: number; lifetime_purchased: number; lifetime_spent: number }
    members: Array<{ id: number; role: string; user: { id: number; name: string; email: string } }>
  }
  api_keys: Array<{
    id: number
    name: string
    prefix: string
    is_active: boolean
    last_used_at: string | null
    expires_at: string | null
    revoked_at: string | null
  }>
  audit_logs: Array<{
    id: number
    action: string
    actor_type: string
    actor_id: number | null
    target_type: string
    target_id: number
    metadata: Record<string, unknown>
    created_at: string
  }>
}

export const adminOrganizationAPI = {
  list: (params?: { search?: string; status?: string; per_page?: number; page?: number }) =>
    apiClient.get<{
      data: AdminOrganizationListItem[]
      current_page: number
      last_page: number
      total: number
    }>('/admin/organizations', { params }),

  show: (organizationId: number) =>
    apiClient.get<{ data: AdminOrganizationDetail }>(`/admin/organizations/${organizationId}`),

  suspend: (organizationId: number, reason: string) =>
    apiClient.post<{ data: AdminOrganizationListItem }>(
      `/admin/organizations/${organizationId}/suspend`,
      { reason }
    ),

  reactivate: (organizationId: number) =>
    apiClient.post<{ data: AdminOrganizationListItem }>(
      `/admin/organizations/${organizationId}/reactivate`
    ),

  adjustCredits: (organizationId: number, amount: number, reason: string) =>
    apiClient.post<{ data: { transaction: unknown; balance: number } }>(
      `/admin/organizations/${organizationId}/credits/adjust`,
      { amount, reason }
    ),
}

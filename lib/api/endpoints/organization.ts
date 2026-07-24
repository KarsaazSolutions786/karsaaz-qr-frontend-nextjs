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
  max_capacity?: number
  organization_type?: string
  org_plan?: {
    id: number
    name: string
    max_seats: number
  }
}

export interface OrganizationMember {
  id: number
  user_id: number
  role: 'owner' | 'admin' | 'developer' | 'billing' | 'viewer' | 'member'
  organization_role_id: number | null
  status: 'pending' | 'pending_setup' | 'active' | 'removed'
  invited_at: string
  joined_at?: string
  user: { id: number; name: string; email: string }
  /** Only present on responses that explicitly load it, e.g. acceptInvite(). */
  organization?: Organization
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
    apiClient.post<{ data: Organization }>('/organization', payload),

  get: (orgId: number) => apiClient.get<{ data: Organization }>(`/organization/${orgId}`),

  update: (orgId: number, payload: Partial<Organization>) =>
    apiClient.patch<{ data: Organization }>(`/organization/${orgId}`, payload),

  delete: (orgId: number) => apiClient.delete(`/organization/${orgId}`),

  // Members
  getMembers: (orgId: number) =>
    apiClient.get<{ data: OrganizationMember[] }>(`/organization/${orgId}/members`),

  inviteMember: (orgId: number, email: string, role: string) =>
    apiClient.post<{ data: OrganizationMember }>(`/organization/${orgId}/members`, { email, role }),

  /** Managed-user creation (spec §3.6) -- provisions a member account directly, no email-invite round trip. The new user gets a password-reset "set up your account" link, never a plaintext password. */
  createManagedUser: (orgId: number, name: string, email: string, role: string) =>
    apiClient.post<{ data: OrganizationMember }>(`/organization/${orgId}/members/managed`, {
      name,
      email,
      role,
    }),

  updateMember: (orgId: number, memberId: number, role: string) =>
    apiClient.put(`/organization/${orgId}/members/${memberId}`, { role }),

  removeMember: (orgId: number, memberId: number) =>
    apiClient.delete(`/organization/${orgId}/members/${memberId}`),

  /** Accept a pending invitation for the currently authenticated user. */
  acceptInvite: (token: string) =>
    apiClient.post<{ data: OrganizationMember }>('/organization-invitations/accept', { token }),

  auditLogs: (orgId: number, page = 1) =>
    apiClient.get<{
      data: OrganizationAuditLogEntry[]
      current_page: number
      last_page: number
      total: number
    }>(`/organization/${orgId}/audit-logs`, { params: { page } }),
}

export interface OrganizationAuditLogEntry {
  id: number
  actor_type: string
  actor_id: number | null
  action: string
  target_type: string | null
  target_id: number | null
  metadata: Record<string, unknown>
  created_at: string
}

// ─── Roles & Permissions (2026-07-20 — DB-backed, spec §5.3/§13.6) ───────────

export interface OrganizationRole {
  id: number
  organization_id: number | null
  slug: string
  name: string
  is_system: boolean
  members_count?: number
  permissions: Array<{ id: number; permission_slug: string }>
}

export const organizationRoleAPI = {
  list: (orgId: number) =>
    apiClient.get<{ data: OrganizationRole[] }>(`/organization/${orgId}/roles`),

  permissions: (orgId: number) =>
    apiClient.get<{ data: string[] }>(`/organization/${orgId}/permissions`),

  create: (orgId: number, payload: { name: string; slug: string; permissions: string[] }) =>
    apiClient.post<{ data: OrganizationRole }>(`/organization/${orgId}/roles`, payload),

  update: (orgId: number, roleId: number, payload: { name: string; permissions: string[] }) =>
    apiClient.patch<{ data: OrganizationRole }>(`/organization/${orgId}/roles/${roleId}`, payload),

  delete: (orgId: number, roleId: number) =>
    apiClient.delete(`/organization/${orgId}/roles/${roleId}`),
}

// ─── Member-Plan Inheritance (2026-07-20 — spec §3.4/§3.5/§5.4/§5.5) ─────────

export interface OrganizationEntitlements {
  plan: {
    id: number
    name: string
    number_of_dynamic_qrcodes?: number
    number_of_scans?: number
    storage_quota_bytes?: number
  }
  source: 'organization_default' | 'organization_override' | 'system_reconciliation'
  is_default: boolean
}

export interface MemberPlanOption {
  subscription_plan: { id: number; name: string; price: number }
  is_default: boolean
  max_assignments: number | null
}

export const organizationMemberPlanAPI = {
  myEntitlements: (orgId: number) =>
    apiClient.get<{ data: OrganizationEntitlements }>(`/organization/${orgId}/entitlements`),

  options: (orgId: number) =>
    apiClient.get<{
      data: { default_plan: { id: number; name: string } | null; allowed_plans: MemberPlanOption[] }
    }>(`/organization/${orgId}/member-plan-options`),

  assign: (orgId: number, membershipId: number, subscriptionPlanId: number) =>
    apiClient.patch<{ data: unknown }>(`/organization/${orgId}/members/${membershipId}/plan`, {
      subscription_plan_id: subscriptionPlanId,
    }),

  removeOverride: (orgId: number, membershipId: number) =>
    apiClient.delete(`/organization/${orgId}/members/${membershipId}/plan-override`),
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

// ─── Dashboard overview ───────────────────────────────────────────────────────
// Replaces the org-portal-only dashboard endpoint (org-portal auth retired
// 2026-07-20 — see gptprompts/orgCompleteFlow&Implimentation.md §3.2).

export interface OrganizationDashboardOverview {
  organization: { id: number; name: string; status: string; plan: string | null }
  qr_created_via_api: number
  api_calls_this_month: number
  credits_spent_month: number
  credits_balance: number
  active_api_keys: number
}

export const orgDashboardAPI = {
  get: (orgId: number) =>
    apiClient.get<{ data: OrganizationDashboardOverview }>(`/organization/${orgId}/dashboard`),
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
  max_seats?: number
  default_subscription_plan_id?: number | null
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

// ─── Org Plan Self-Service (owner/billing-manager, Sanctum user auth) ────────
// Replaces the org-portal-only plans/selectPlan endpoints (org-portal auth
// retired 2026-07-20). Unlike orgPlanAPI.assignToOrg (super-admin only, no
// payment step), selectForSelf drives the owner-initiated plan-change flow:
// free plans assign immediately, paid plans return a Stripe checkout URL.

export const orgPlanSelfServiceAPI = {
  get: (orgId: number) =>
    apiClient.get<{ data: { current_plan: OrgPlan | null; available_plans: OrgPlan[] } }>(
      `/organization/${orgId}/org-plan`
    ),

  /**
   * Free plan (or re-selecting the current plan): resolves with
   * `{ message, data: Organization }` — the plan is already assigned.
   * Paid plan: resolves with `{ data: { checkout_url } }` — redirect the
   * owner to Stripe; the plan is assigned by the webhook on completion.
   */
  select: (orgId: number, orgPlanId: number) =>
    apiClient.post<{ message?: string; data?: { checkout_url?: string } | Organization }>(
      `/organization/${orgId}/org-plan/select`,
      { org_plan_id: orgPlanId }
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

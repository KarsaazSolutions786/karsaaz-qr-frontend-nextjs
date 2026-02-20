import apiClient from '../client'

// ── Types ────────────────────────────────────────────────────────────────

export interface StripePaymentMethod {
  id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  is_default: boolean
}

export interface StripeInvoice {
  id: string
  number: string
  date: string
  amount: number
  currency: string
  status: 'paid' | 'open' | 'draft' | 'void' | 'uncollectible'
  pdf_url?: string
  hosted_invoice_url?: string
}

export interface StripeSubscription {
  id: string
  status: 'active' | 'paused' | 'canceled' | 'incomplete' | 'trialing' | 'past_due'
  plan_name?: string
  amount?: number
  interval?: string
  current_period_start?: string
  current_period_end?: string
  trial_end?: string
  resume_at?: string
  cancel_at_period_end?: boolean
}

export interface PauseSubscriptionRequest {
  behavior?: 'mark_uncollectible' | 'keep_as_draft' | 'void'
  resume_at?: string
}

export interface UpdateSubscriptionRequest {
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice'
  billing_cycle_anchor?: 'now' | 'unchanged'
}

// ── Customer Portal ──────────────────────────────────────────────────────

export async function getCustomerPortalUrl() {
  return apiClient.post<{ url: string }>('/stripe/customer-portal')
}

// ── Payment Methods ──────────────────────────────────────────────────────

export async function getPaymentMethods() {
  return apiClient.get<StripePaymentMethod[]>('/stripe/payment-methods')
}

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  return apiClient.post('/stripe/payment-methods/default', { payment_method_id: paymentMethodId })
}

export async function removePaymentMethod(paymentMethodId: string) {
  return apiClient.post(`/stripe/payment-methods/${paymentMethodId}`, { _method: 'DELETE' })
}

// ── Invoices ─────────────────────────────────────────────────────────────

export async function getInvoices(limit: number = 10) {
  return apiClient.get<StripeInvoice[]>('/stripe/invoices', { params: { limit } })
}

// ── Subscription Management ──────────────────────────────────────────────

export async function getStripeSubscription() {
  return apiClient.get<StripeSubscription>('/stripe/subscription')
}

export async function pauseSubscription(data?: PauseSubscriptionRequest) {
  return apiClient.post<StripeSubscription>('/stripe/subscription/pause', data)
}

export async function resumeSubscription() {
  return apiClient.post<StripeSubscription>('/stripe/subscription/resume')
}

export async function updateSubscription(data: UpdateSubscriptionRequest) {
  return apiClient.post<StripeSubscription>('/stripe/subscription/update', data)
}

import apiClient from '../client'

// ── Types ──────────────────────────────────────────────────────

export interface PayPalSubscribeRequest {
  subscription_plan_id: number | string
}

export interface PayPalSubscribeResponse {
  id: number
  status: string
  plan_id: number
  user_id: number
}

export interface PayPalUpdateIdsRequest {
  paypal_id: string
  paypal_order_id: string
}

export interface PayPalChargeLinkResponse {
  link: string
}

export interface PaymentProcessor {
  id: number
  name: string
  slug: string
  is_enabled: boolean
  settings?: Record<string, string>
}

// ── API Functions ──────────────────────────────────────────────

/**
 * Create a subscription record before PayPal approval.
 * POST /api/subscriptions/subscribe
 */
export async function createPayPalSubscription(data: PayPalSubscribeRequest) {
  return apiClient.post<PayPalSubscribeResponse>('/subscriptions/subscribe', data)
}

/**
 * Update subscription with PayPal IDs after approval.
 * PUT /api/subscriptions/{id}/update-paypal-ids
 */
export async function updatePayPalIds(subscriptionId: number, data: PayPalUpdateIdsRequest) {
  return apiClient.put(`/subscriptions/${subscriptionId}/update-paypal-ids`, data)
}

/**
 * Generate a PayPal one-time charge link for account credit.
 * POST /api/payment-processors/paypal/create-charge-link/{amount}
 */
export async function createPayPalChargeLink(amount: number) {
  return apiClient.post<PayPalChargeLinkResponse>(
    `/payment-processors/paypal/create-charge-link/${amount}`
  )
}

/**
 * Fetch available payment processors.
 * GET /api/payment-processors
 */
export async function getPaymentProcessors() {
  return apiClient.get<PaymentProcessor[]>('/payment-processors')
}

/**
 * Update payment processor settings.
 * PUT /api/payment-processors/{slug}
 */
export async function updatePaymentProcessor(
  slug: string,
  data: { is_enabled?: boolean; settings?: Record<string, string> }
) {
  return apiClient.put<PaymentProcessor>(`/payment-processors/${slug}`, data)
}

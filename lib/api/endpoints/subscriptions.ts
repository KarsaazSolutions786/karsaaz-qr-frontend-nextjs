import apiClient from '../client'
import { Plan, Subscription, PromoCode } from '@/types/entities/subscription'

export interface SubscribeRequest {
  subscription_plan_id: number | string
  promo_code_data?: {
    promo_code: string
    discount_percent?: number
    coupon_id?: string
    referrer_user_id?: string
  }
}

export interface SubscribeResponse {
  id: number
  status: string
  plan_id: number
  user_id: number
}

export interface ValidatePromoCodeRequest {
  code: string
  planId: string
}

export interface ValidatePromoCodeResponse {
  valid: boolean
  promoCode?: PromoCode
  discountedPrice?: number
}

export interface CreateCheckoutSessionRequest {
  planId: string
  promoCode?: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutSessionResponse {
  sessionId: string
  url: string
}

/**
 * Fetch all available subscription plans
 */
export async function getPlans() {
  return apiClient.get<Plan[]>('/plans')
}

/**
 * Get current user's subscription
 */
export async function getSubscription() {
  return apiClient.get<Subscription>('/subscriptions/current')
}

/**
 * Subscribe to a plan (creates subscription record).
 * PUT /subscriptions/subscribe
 */
export async function subscribe(data: SubscribeRequest) {
  return apiClient.put<SubscribeResponse>('/subscriptions/subscribe', data)
}

/**
 * Cancel subscription (at end of current period)
 */
export async function cancelSubscription() {
  return apiClient.delete<Subscription>('/subscriptions/current')
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription() {
  return apiClient.post<Subscription>('/subscriptions/current/reactivate')
}

/**
 * Validate a promo code
 */
export async function validatePromoCode(data: ValidatePromoCodeRequest) {
  return apiClient.post<ValidatePromoCodeResponse>('/promo-codes/validate', data)
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(data: CreateCheckoutSessionRequest) {
  return apiClient.post<CreateCheckoutSessionResponse>('/stripe/checkout-session', data)
}

/**
 * Generate a payment link for a given processor and plan.
 * POST /payment-processors/{slug}/generate-pay-link/{planId}
 * Returns { link: string } — browser should redirect to link.
 */
export async function generatePayLink(
  processorSlug: string,
  planId: number | string,
  data?: Record<string, any>,
  isChangePlan?: boolean
) {
  const params = isChangePlan ? '?action=change-plan' : ''
  const response = await apiClient.post<{ link: string }>(
    `/payment-processors/${processorSlug}/generate-pay-link/${planId}${params}`,
    data ?? {}
  )
  return response.data
}

/**
 * Stripe checkout for an existing subscription.
 * POST /checkout/stripe/{subscriptionId}
 * Returns { url: string } — browser should redirect to url.
 */
export async function stripeCheckout(subscriptionId: number | string) {
  const response = await apiClient.post<{ url: string }>(
    `/checkout/stripe/${subscriptionId}`
  )
  return response.data
}

/**
 * Get subscription billing history
 */
export async function getBillingHistory() {
  return apiClient.get<any[]>('/subscriptions/billing-history')
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(paymentMethodId: string) {
  return apiClient.put('/subscriptions/payment-method', { paymentMethodId })
}

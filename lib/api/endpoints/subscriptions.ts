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
 * Purpose: Fetch all available subscription plans
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getPlans() {
  return apiClient.get<Plan[]>('/plans')
}

/**
 * Purpose: Get current user's subscription
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getSubscription() {
  return apiClient.get<Subscription>('/subscriptions/current')
}

/**
 * Purpose: Subscribe to a plan (creates subscription record). PUT /subscriptions/subscribe
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function subscribe(data: SubscribeRequest) {
  return apiClient.put<SubscribeResponse>('/subscriptions/subscribe', data)
}

/**
 * Purpose: Cancel subscription (at end of current period)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function cancelSubscription() {
  return apiClient.delete<Subscription>('/subscriptions/current')
}

/**
 * Purpose: Reactivate a canceled subscription
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function reactivateSubscription() {
  return apiClient.post<Subscription>('/subscriptions/current/reactivate')
}

/**
 * Purpose: Validate a promo code
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function validatePromoCode(data: ValidatePromoCodeRequest) {
  return apiClient.post<ValidatePromoCodeResponse>('/promo-codes/validate', data)
}

/**
 * Purpose: Create a Stripe checkout session
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function createCheckoutSession(data: CreateCheckoutSessionRequest) {
  return apiClient.post<CreateCheckoutSessionResponse>('/stripe/checkout-session', data)
}

/**
 * Purpose: Generate a payment link for a given processor and plan. POST /payment-processors/{slug}/generate-pay-link/{planId} Returns { link: string } — browser should redirect to link.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function generatePayLink(
  processorSlug: string,
  planId: number | string,
  data?: Record<string, any>,
  isChangePlan?: boolean
) {
  const params = isChangePlan ? '?action=change-plan' : ''
  const response = await apiClient.post<{ success: boolean; data: { link: string } }>(
    `/payment-processors/${processorSlug}/generate-pay-link/${planId}${params}`,
    data ?? {}
  )
  // The API wraps the link in a nested data object: { success: true, data: { link: "..." } }
  return response.data.data
}

/**
 * Purpose: Stripe checkout for an existing subscription. POST /checkout/stripe/{subscriptionId} Returns { url: string } — browser should redirect to url.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function stripeCheckout(subscriptionId: number | string) {
  const response = await apiClient.post<{ url: string }>(
    `/checkout/stripe/${subscriptionId}`
  )
  return response.data
}

/**
 * Purpose: Get subscription billing history
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function getBillingHistory() {
  return apiClient.get<any[]>('/subscriptions/billing-history')
}

/**
 * Purpose: Update payment method
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function updatePaymentMethod(paymentMethodId: string) {
  return apiClient.put('/subscriptions/payment-method', { paymentMethodId })
}

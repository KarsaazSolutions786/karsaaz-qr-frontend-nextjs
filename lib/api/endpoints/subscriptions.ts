import apiClient from '../client'
import { Plan, Subscription, PromoCode } from '@/types/entities/subscription'

export interface SubscribeRequest {
  planId: string
  promoCode?: string
  paymentMethodId?: string
}

export interface SubscribeResponse {
  subscription: Subscription
  clientSecret?: string // For 3D Secure
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
 * Subscribe to a plan
 */
export async function subscribe(data: SubscribeRequest) {
  return apiClient.post<SubscribeResponse>('/subscriptions', data)
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

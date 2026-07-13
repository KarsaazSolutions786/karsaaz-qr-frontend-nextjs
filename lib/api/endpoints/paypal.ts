import apiClient from '../client'

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


export async function createPayPalSubscription(data: PayPalSubscribeRequest) {
  return apiClient.post<PayPalSubscribeResponse>('/subscriptions/subscribe', data)
}


export async function updatePayPalIds(subscriptionId: number, data: PayPalUpdateIdsRequest) {
  return apiClient.put(`/subscriptions/${subscriptionId}/update-paypal-ids`, data)
}


export async function createPayPalChargeLink(amount: number) {
  return apiClient.post<PayPalChargeLinkResponse>(
    `/payment-processors/paypal/create-charge-link/${amount}`
  )
}



export async function getPaymentProcessors() {
  return apiClient.get<PaymentProcessor[]>('/payment-processors')
}

export async function updatePaymentProcessor(
  slug: string,
  data: { is_enabled?: boolean; settings?: Record<string, string> }
) {
  return apiClient.put<PaymentProcessor>(`/payment-processors/${slug}`, data)
}

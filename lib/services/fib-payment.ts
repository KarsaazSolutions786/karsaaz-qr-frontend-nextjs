import apiClient from '@/lib/api/client'

export interface FIBPaymentConfig {
  client_id: string
  client_secret: string
  merchant_id: string
  callback_url: string
  mode: 'staging' | 'production'
  amount: number
  currency?: string
  description?: string
}

export interface FIBPaymentResponse {
  payment_id: string
  readable_code: string
  qr_code: string
  personal_app_link: string
  business_app_link: string
  corporate_app_link: string
  valid_until: string
}

export interface FIBPaymentError {
  code: string
  message: string
}

/**
 * Purpose: Initialize a FIB (First Iraqi Bank) payment session. Sends payment config to the backend, which handles the FIB API call and returns payment details including QR code for the customer.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function initFIBPayment(
  config: Pick<FIBPaymentConfig, 'amount' | 'currency' | 'description'>
): Promise<FIBPaymentResponse> {
  const response = await apiClient.post<FIBPaymentResponse>(
    '/payment-processors/fib/create-payment',
    {
      amount: config.amount,
      currency: config.currency ?? 'IQD',
      description: config.description,
    }
  )
  return response.data
}

/**
 * Purpose: Handle a successful FIB payment callback. Called after the customer completes the payment via the FIB app.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function handleFIBSuccess(response: {
  payment_id: string
  status: string
}): Promise<{ success: boolean; message: string }> {
  const result = await apiClient.post<{ success: boolean; message: string }>(
    '/payment-processors/fib/payment-success',
    {
      payment_id: response.payment_id,
      status: response.status,
    }
  )
  return result.data
}

/**
 * Purpose: Handle a FIB payment failure or cancellation.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function handleFIBFailure(error: {
  payment_id?: string
  code?: string
  message?: string
}): Promise<{ acknowledged: boolean }> {
  const result = await apiClient.post<{ acknowledged: boolean }>(
    '/payment-processors/fib/payment-failure',
    {
      payment_id: error.payment_id,
      error_code: error.code,
      error_message: error.message,
    }
  )
  return result.data
}

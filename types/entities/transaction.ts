export interface Transaction {
  id: string // UUID or numeric string
  userId: string
  subscriptionId?: string
  type?: 'payment' | 'refund' | 'failed_payment'
  amount: number // Amount in cents (or raw amount)
  currency: string // e.g., "USD"
  status: 'pending' | 'completed' | 'failed'

  // Backend-specific fields (used by admin transactions list)
  source?: string // e.g. 'stripe' | 'offline-payment' | 'paypal' | 'razorpay'
  formatted_amount?: string // e.g. "$29.99"
  user_name?: string // denormalized from user relationship
  subscription_plan_name?: string // denormalized from subscription plan
  stripe_payment_intent_id?: string
  payment_proof?: string // file path — only for offline-payment source

  // Camel-case legacy fields
  stripePaymentIntentId?: string
  stripeInvoiceId?: string
  description?: string
  createdAt: string // ISO 8601
  updatedAt?: string
  created_at?: string // snake_case from backend
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank_account'
  last4?: string // Last 4 digits for cards
  brand?: string // e.g., "visa", "mastercard"
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  stripePaymentMethodId?: string
}

export interface Invoice {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  invoiceUrl?: string
  invoicePdf?: string
  stripeInvoiceId?: string
  periodStart: string // ISO 8601
  periodEnd: string // ISO 8601
  dueDate?: string // ISO 8601
  paidAt?: string // ISO 8601
  createdAt: string
}

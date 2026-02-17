export interface Transaction {
  id: string // UUID
  userId: string
  subscriptionId: string
  type: 'payment' | 'refund' | 'failed_payment'
  amount: number // Amount in cents
  currency: string // e.g., "USD"
  status: 'pending' | 'completed' | 'failed'
  stripePaymentIntentId?: string
  stripeInvoiceId?: string
  description?: string
  createdAt: string // ISO 8601
  updatedAt: string
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

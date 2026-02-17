import { z } from 'zod'

// Promo code validation schema
export const applyPromoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required').toUpperCase(),
})

export type ApplyPromoCodeFormData = z.infer<typeof applyPromoCodeSchema>

// Subscribe schema
export const subscribeSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  promoCode: z.string().optional(),
  paymentMethodId: z.string().optional(), // Stripe payment method ID
})

export type SubscribeFormData = z.infer<typeof subscribeSchema>

// Cancel subscription schema
export const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
  feedback: z.string().max(500, 'Feedback must be less than 500 characters').optional(),
})

export type CancelSubscriptionFormData = z.infer<typeof cancelSubscriptionSchema>

// Update payment method schema
export const updatePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'), // Stripe payment method ID
})

export type UpdatePaymentMethodFormData = z.infer<typeof updatePaymentMethodSchema>

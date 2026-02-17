import { NextRequest, NextResponse } from 'next/server'

/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives webhook events from Stripe for:
 * - Payment success/failure
 * - Subscription updates
 * - Invoice updates
 * 
 * NOTE: In production, verify the webhook signature using Stripe's SDK
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // TODO: Verify webhook signature
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // )

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object)
        // Forward to backend API to create/update subscription
        break

      case 'invoice.paid':
        console.log('Invoice paid:', event.data.object)
        // Update subscription status
        break

      case 'invoice.payment_failed':
        console.log('Invoice payment failed:', event.data.object)
        // Notify user of failed payment
        break

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object)
        // Update subscription in database
        break

      case 'customer.subscription.deleted':
        console.log('Subscription deleted:', event.data.object)
        // Mark subscription as canceled
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

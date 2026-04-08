import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Stripe Webhook Handler
 * 
 * Verifies the Stripe-Signature header using HMAC-SHA256 before processing
 * any event. Requires STRIPE_WEBHOOK_SECRET in environment variables.
 */

interface StripeEvent {
  type: string
  data: { object: unknown }
}

/**
 * Verify Stripe webhook signature using HMAC-SHA256 without the stripe SDK.
 * Signature format: "t=<timestamp>,v1=<hex-signature>"
 */
function verifyStripeSignature(body: string, signature: string, secret: string): StripeEvent {
  const parts = signature.split(',')
  const tPart = parts.find((p) => p.startsWith('t='))
  const v1Part = parts.find((p) => p.startsWith('v1='))

  if (!tPart || !v1Part) {
    throw new Error('Invalid stripe-signature format')
  }

  const timestamp = tPart.slice(2)
  const expectedSig = v1Part.slice(3)

  const payload = `${timestamp}.${body}`
  const computed = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex')

  if (computed !== expectedSig) {
    throw new Error('Webhook signature verification failed')
  }

  // Guard against replay attacks (5 minute tolerance)
  const eventTime = parseInt(timestamp, 10)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - eventTime) > 300) {
    throw new Error('Webhook timestamp too old')
  }

  return JSON.parse(body) as StripeEvent
}

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

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: StripeEvent
    try {
      event = verifyStripeSignature(body, signature, webhookSecret)
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // Forward to backend API to create/update subscription
        break

      case 'invoice.paid':
        // Update subscription status
        break

      case 'invoice.payment_failed':
        // Notify user of failed payment
        break

      case 'customer.subscription.updated':
        // Update subscription in database
        break

      case 'customer.subscription.deleted':
        // Mark subscription as canceled
        break

      default:
        // Unhandled event type — acknowledged but not processed
        break
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

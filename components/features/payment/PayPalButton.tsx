'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  createPayPalSubscription,
  updatePayPalIds,
} from '@/lib/api/endpoints/paypal'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalButtonProps {
  /** The plan being subscribed to */
  plan: {
    id: string
    name: string
    paypal_plan_id?: string
    price: number
  }
  /** PayPal client ID from config */
  clientId: string
  /** Optional promo code to apply */
  promoCode?: string
}

export function PayPalButton({ plan, clientId, promoCode }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const router = useRouter()

  // Load PayPal SDK
  useEffect(() => {
    if (!clientId) {
      setError('PayPal is not configured.')
      setLoading(false)
      return
    }

    // Check if SDK already loaded
    if (window.paypal) {
      setSdkLoaded(true)
      setLoading(false)
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription&components=buttons`
    script.async = true

    script.onload = () => {
      setSdkLoaded(true)
      setLoading(false)
    }

    script.onerror = () => {
      setError('Failed to load PayPal SDK.')
      setLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount only if we added it
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [clientId])

  // Render PayPal buttons once SDK is loaded
  const renderButtons = useCallback(() => {
    if (!sdkLoaded || !window.paypal || !containerRef.current) return

    // Clear previous buttons
    containerRef.current.innerHTML = ''

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },

        createSubscription: async (_data: any, actions: any) => {
          // Create subscription record on our backend first
          const { data: subscription } = await createPayPalSubscription({
            subscription_plan_id: plan.id,
          })

          // Create PayPal subscription
          return actions.subscription.create({
            plan_id: plan.paypal_plan_id,
            custom_id: String(subscription.id),
          })
        },

        onApprove: async (data: any) => {
          try {
            // Extract the subscription ID from createSubscription response
            const subscriptionId = data.subscriptionID
            const orderId = data.orderID

            // Find our internal subscription from the custom_id
            // The backend should handle mapping. We update PayPal IDs.
            await updatePayPalIds(Number(data.subscriptionID) || 0, {
              paypal_id: subscriptionId,
              paypal_order_id: orderId,
            })

            // Redirect to success page
            window.location.href = '/payment/success?payment_gateway=paypal'
          } catch {
            setError('Payment approved but failed to save. Please contact support.')
          }
        },

        onError: (err: any) => {
          console.error('PayPal error:', err)
          setError('PayPal encountered an error. Please try again.')
        },

        onCancel: () => {
          router.push('/payment/canceled')
        },
      })
      .render(containerRef.current)
  }, [sdkLoaded, plan, promoCode, router])

  useEffect(() => {
    renderButtons()
  }, [renderButtons])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600" />
          <span className="ml-2 text-sm text-gray-500">Loading PayPal...</span>
        </div>
      )}
      <div ref={containerRef} className={loading ? 'hidden' : ''} />
    </div>
  )
}

import { lazy } from 'react'
import type { ComponentType } from 'react'

interface ProcessorFormProps {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

type LazyProcessorComponent = React.LazyExoticComponent<ComponentType<ProcessorFormProps>>

/**
 * Registry mapping processor slugs to their lazy-loaded form components.
 *
 * The slug must match the `id` used in the PROCESSORS array on the
 * payment-processors page. When a match is found here, the custom form
 * is rendered instead of the generic field-based fallback.
 */
export const PROCESSOR_REGISTRY: Record<string, LazyProcessorComponent> = {
  // ── Core gateways ──────────────────────────────────────────────────────────
  stripe: lazy(() => import('./StripeForm').then(m => ({ default: m.StripeForm }))),

  // ── WS-3A: Top 3 ──────────────────────────────────────────────────────────
  razorpay: lazy(() => import('./RazorpayForm').then(m => ({ default: m.RazorpayForm }))),
  paystack: lazy(() => import('./PayStackForm').then(m => ({ default: m.PayStackForm }))),
  flutterwave: lazy(() => import('./FlutterwaveForm').then(m => ({ default: m.FlutterwaveForm }))),

  // ── WS-3B: Offline + Regional ──────────────────────────────────────────────
  'offline-payments': lazy(() =>
    import('./OfflinePaymentForm').then(m => ({ default: m.OfflinePaymentForm }))
  ),
  mollie: lazy(() => import('./MollieForm').then(m => ({ default: m.MollieForm }))),
  paddle: lazy(() => import('./PaddleForm').then(m => ({ default: m.PaddleForm }))),
  'paddle-billing': lazy(() =>
    import('./PaddleBillingForm').then(m => ({ default: m.PaddleBillingForm }))
  ),

  // ── Other gateways ─────────────────────────────────────────────────────────
  mercadopago: lazy(() => import('./MercadoPagoForm').then(m => ({ default: m.MercadoPagoForm }))),
  '2checkout': lazy(() => import('./TwoCheckoutForm').then(m => ({ default: m.TwoCheckoutForm }))),
  'alipay-china': lazy(() => import('./AlipayForm').then(m => ({ default: m.AlipayForm }))),
  payfast: lazy(() => import('./PayFastForm').then(m => ({ default: m.PayFastForm }))),
  'payu-international': lazy(() =>
    import('./PayUInternationalForm').then(m => ({ default: m.PayUInternationalForm }))
  ),
  'payu-latam': lazy(() => import('./PayULatamForm').then(m => ({ default: m.PayULatamForm }))),
  xendit: lazy(() => import('./XenditForm').then(m => ({ default: m.XenditForm }))),
  yookassa: lazy(() => import('./YookassaForm').then(m => ({ default: m.YookassaForm }))),
  dintero: lazy(() => import('./DinteroForm').then(m => ({ default: m.DinteroForm }))),
  paykickstart: lazy(() =>
    import('./PayKickstartForm').then(m => ({ default: m.PayKickstartForm }))
  ),
  paytr: lazy(() => import('./PayTRForm').then(m => ({ default: m.PayTRForm }))),
  postfinance: lazy(() => import('./PostFinanceForm').then(m => ({ default: m.PostFinanceForm }))),
  'orange-bf': lazy(() =>
    import('./OrangeBillingForm').then(m => ({ default: m.OrangeBillingForm }))
  ),
  fib: lazy(() => import('./FIBForm').then(m => ({ default: m.FIBForm }))),
}

import { lazy } from 'react'
import type { ComponentType } from 'react'

interface ProcessorFormProps {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

type LazyProcessorComponent = React.LazyExoticComponent<ComponentType<ProcessorFormProps>>

export const PROCESSOR_REGISTRY: Record<string, LazyProcessorComponent> = {
  razorpay: lazy(() => import('./RazorpayForm').then(m => ({ default: m.RazorpayForm }))),
  paystack: lazy(() => import('./PayStackForm').then(m => ({ default: m.PayStackForm }))),
  flutterwave: lazy(() => import('./FlutterwaveForm').then(m => ({ default: m.FlutterwaveForm }))),
  mercadopago: lazy(() => import('./MercadoPagoForm').then(m => ({ default: m.MercadoPagoForm }))),
  mollie: lazy(() => import('./MollieForm').then(m => ({ default: m.MollieForm }))),
  '2checkout': lazy(() => import('./TwoCheckoutForm').then(m => ({ default: m.TwoCheckoutForm }))),
  alipay: lazy(() => import('./AlipayForm').then(m => ({ default: m.AlipayForm }))),
  payfast: lazy(() => import('./PayFastForm').then(m => ({ default: m.PayFastForm }))),
  'payu-international': lazy(() =>
    import('./PayUInternationalForm').then(m => ({ default: m.PayUInternationalForm }))
  ),
  'payu-latam': lazy(() => import('./PayULatamForm').then(m => ({ default: m.PayULatamForm }))),
  paddle: lazy(() => import('./PaddleForm').then(m => ({ default: m.PaddleForm }))),
  xendit: lazy(() => import('./XenditForm').then(m => ({ default: m.XenditForm }))),
  yookassa: lazy(() => import('./YookassaForm').then(m => ({ default: m.YookassaForm }))),
  dintero: lazy(() => import('./DinteroForm').then(m => ({ default: m.DinteroForm }))),
  paykickstart: lazy(() =>
    import('./PayKickstartForm').then(m => ({ default: m.PayKickstartForm }))
  ),
  paytr: lazy(() => import('./PayTRForm').then(m => ({ default: m.PayTRForm }))),
  postfinance: lazy(() => import('./PostFinanceForm').then(m => ({ default: m.PostFinanceForm }))),
  'orange-billing': lazy(() =>
    import('./OrangeBillingForm').then(m => ({ default: m.OrangeBillingForm }))
  ),
  fib: lazy(() => import('./FIBForm').then(m => ({ default: m.FIBForm }))),
  offline: lazy(() =>
    import('./OfflinePaymentForm').then(m => ({ default: m.OfflinePaymentForm }))
  ),
}

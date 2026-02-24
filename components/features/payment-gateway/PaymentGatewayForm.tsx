'use client'

import { useForm, Controller } from 'react-hook-form'
import PaymentProcessorFormBase from './PaymentProcessorFormBase'
import { StripeForm } from '../payment-processors/StripeForm'
import { RazorpayForm } from '../payment-processors/RazorpayForm'
import { AlipayForm } from '../payment-processors/AlipayForm'
import { FlutterwaveForm } from '../payment-processors/FlutterwaveForm'
import { MercadoPagoForm } from '../payment-processors/MercadoPagoForm'
import { MollieForm } from '../payment-processors/MollieForm'
import { PayFastForm } from '../payment-processors/PayFastForm'
import { PayStackForm } from '../payment-processors/PayStackForm'
import { PayUInternationalForm } from '../payment-processors/PayUInternationalForm'
import { PayULatamForm } from '../payment-processors/PayULatamForm'
import { PostFinanceForm } from '../payment-processors/PostFinanceForm'
import { TwoCheckoutForm } from '../payment-processors/TwoCheckoutForm'
import { XenditForm } from '../payment-processors/XenditForm'
import { YookassaForm } from '../payment-processors/YookassaForm'
import { DinteroForm } from '../payment-processors/DinteroForm'
import { PayTRForm } from '../payment-processors/PayTRForm'
import { FIBForm } from '../payment-processors/FIBForm'
import { OrangeBillingForm } from '../payment-processors/OrangeBillingForm'
import { PaddleForm } from '../payment-processors/PaddleForm'
import { PayKickstartForm } from '../payment-processors/PayKickstartForm'
import { OfflinePaymentForm } from '../payment-processors/OfflinePaymentForm'
import type { PaymentGateway, PaymentProcessorSlug } from '@/types/entities/payment-gateway'

const PROCESSOR_SLUGS: { value: PaymentProcessorSlug; label: string }[] = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'paystack', label: 'PayStack' },
  { value: 'flutterwave', label: 'Flutterwave' },
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'mollie', label: 'Mollie' },
  { value: '2checkout', label: '2Checkout' },
  { value: 'alipay', label: 'Alipay' },
  { value: 'payfast', label: 'PayFast' },
  { value: 'payu-international', label: 'PayU International' },
  { value: 'payu-latam', label: 'PayU Latam' },
  { value: 'paddle', label: 'Paddle' },
  { value: 'xendit', label: 'Xendit' },
  { value: 'yookassa', label: 'YooKassa' },
  { value: 'dintero', label: 'Dintero' },
  { value: 'paykickstart', label: 'PayKickstart' },
  { value: 'paytr', label: 'PayTR' },
  { value: 'postfinance', label: 'Post Finance' },
  { value: 'orange-bf', label: 'Orange (Mobile Money)' },
  { value: 'offline', label: 'Offline' },
  { value: 'fib', label: 'FIB' },
]

interface PaymentGatewayFormValues {
  name: string
  slug: string
  enabled: boolean
  mode: 'sandbox' | 'live'
  settings: Record<string, string>
  supports_recurring: boolean
}

interface PaymentGatewayFormProps {
  initialData?: PaymentGateway
  onSubmit: (data: PaymentGatewayFormValues) => Promise<void>
  isSubmitting?: boolean
}

function renderProcessorForm(
  slug: string,
  settings: Record<string, string>,
  onChange: (key: string, value: string) => void
) {
  switch (slug) {
    case 'stripe':
      return <StripeForm settings={settings} onChange={onChange} />
    case 'razorpay':
      return <RazorpayForm settings={settings} onChange={onChange} />
    case 'alipay':
      return <AlipayForm settings={settings} onChange={onChange} />
    case 'flutterwave':
      return <FlutterwaveForm settings={settings} onChange={onChange} />
    case 'mercadopago':
      return <MercadoPagoForm settings={settings} onChange={onChange} />
    case 'mollie':
      return <MollieForm settings={settings} onChange={onChange} />
    case 'payfast':
      return <PayFastForm settings={settings} onChange={onChange} />
    case 'paystack':
      return <PayStackForm settings={settings} onChange={onChange} />
    case 'payu-international':
      return <PayUInternationalForm settings={settings} onChange={onChange} />
    case 'payu-latam':
      return <PayULatamForm settings={settings} onChange={onChange} />
    case 'postfinance':
      return <PostFinanceForm settings={settings} onChange={onChange} />
    case '2checkout':
      return <TwoCheckoutForm settings={settings} onChange={onChange} />
    case 'xendit':
      return <XenditForm settings={settings} onChange={onChange} />
    case 'yookassa':
      return <YookassaForm settings={settings} onChange={onChange} />
    case 'dintero':
      return <DinteroForm settings={settings} onChange={onChange} />
    case 'paytr':
      return <PayTRForm settings={settings} onChange={onChange} />
    case 'fib':
      return <FIBForm settings={settings} onChange={onChange} />
    case 'orange-bf':
      return <OrangeBillingForm settings={settings} onChange={onChange} />
    case 'paddle':
      return <PaddleForm settings={settings} onChange={onChange} />
    case 'paykickstart':
      return <PayKickstartForm settings={settings} onChange={onChange} />
    case 'offline':
      return <OfflinePaymentForm settings={settings} onChange={onChange} />
    default:
      return <PaymentProcessorFormBase slug={slug} settings={settings} onChange={onChange} />
  }
}

export default function PaymentGatewayForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PaymentGatewayFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentGatewayFormValues>({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      enabled: initialData?.enabled ?? true,
      mode: initialData?.mode ?? 'sandbox',
      settings: initialData?.settings ?? {},
      supports_recurring: initialData?.supports_recurring ?? false,
    },
  })

  const settings = watch('settings')
  const slug = watch('slug')

  const handleSettingChange = (key: string, value: string) => {
    setValue('settings', { ...settings, [key]: value })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="gw-name" className="block text-sm font-medium text-gray-700">
            Gateway Name
          </label>
          <input
            id="gw-name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            placeholder="e.g. Stripe Production"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        {/* Slug selector */}
        <div>
          <label htmlFor="gw-slug" className="block text-sm font-medium text-gray-700">
            Processor
          </label>
          <select
            id="gw-slug"
            {...register('slug', { required: 'Processor is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          >
            <option value="">Select a processor…</option>
            {PROCESSOR_SLUGS.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
        </div>

        {/* Enabled toggle */}
        <div className="flex items-center gap-3">
          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  field.value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={field.value}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    field.value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
          />
          <span className="text-sm text-gray-700">Enabled</span>
        </div>

        {/* Supports Recurring */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="gw-recurring"
            {...register('supports_recurring')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="gw-recurring" className="text-sm text-gray-700">
            Supports recurring payments
          </label>
        </div>
      </div>

      {/* Processor-specific settings */}
      {slug && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Processor Settings</h3>
          {renderProcessorForm(slug, settings, handleSettingChange)}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : initialData ? 'Update Gateway' : 'Create Gateway'}
        </button>
      </div>
    </form>
  )
}

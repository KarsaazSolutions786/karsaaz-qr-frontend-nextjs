'use client'

import { useForm, Controller } from 'react-hook-form'
import PaymentProcessorFormBase from './PaymentProcessorFormBase'
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

export default function PaymentGatewayForm({ initialData, onSubmit, isSubmitting }: PaymentGatewayFormProps) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PaymentGatewayFormValues>({
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
          <label htmlFor="gw-name" className="block text-sm font-medium text-gray-700">Gateway Name</label>
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
          <label htmlFor="gw-slug" className="block text-sm font-medium text-gray-700">Processor</label>
          <select
            id="gw-slug"
            {...register('slug', { required: 'Processor is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          >
            <option value="">Select a processor…</option>
            {PROCESSOR_SLUGS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
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
          <label htmlFor="gw-recurring" className="text-sm text-gray-700">Supports recurring payments</label>
        </div>
      </div>

      {/* Processor-specific settings */}
      {slug && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Processor Settings</h3>
          <PaymentProcessorFormBase
            slug={slug}
            settings={settings}
            onChange={handleSettingChange}
          />
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

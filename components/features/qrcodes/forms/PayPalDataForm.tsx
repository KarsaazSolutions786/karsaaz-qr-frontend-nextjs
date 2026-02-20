'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paypalDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type PayPalDataFormData = z.infer<typeof paypalDataSchema>

interface PayPalDataFormProps {
  defaultValues?: PayPalDataFormData
  onSubmit: (data: PayPalDataFormData) => void
}

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN',
  'CHF', 'SEK', 'NOK', 'DKK', 'NZD', 'SGD', 'HKD', 'KRW', 'TWD', 'THB',
]

export function PayPalDataForm({ defaultValues, onSubmit }: PayPalDataFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PayPalDataFormData>({
    resolver: zodResolver(paypalDataSchema),
    defaultValues: { type: '_xclick', currency: 'USD', ...defaultValues },
  })

  const paymentType = useWatch({ control, name: 'type' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Payment Type</label>
        <select {...register('type')} id="type" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          <option value="_xclick">Buy Now</option>
          <option value="_donations">Donation</option>
          <option value="_cart">Add to Cart</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">PayPal Email</label>
        <input {...register('email')} id="email" type="email" placeholder="your@paypal.com" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">Item Name</label>
        <input {...register('item_name')} id="item_name" type="text" placeholder="e.g. Product Name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.item_name && <p className="mt-1 text-sm text-red-600">{errors.item_name.message}</p>}
      </div>
      <div>
        <label htmlFor="item_id" className="block text-sm font-medium text-gray-700">Item ID</label>
        <input {...register('item_id')} id="item_id" type="text" placeholder="e.g. SKU-001" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.item_id && <p className="mt-1 text-sm text-red-600">{errors.item_id.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="0.01" placeholder="0.00" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <select {...register('currency')} id="currency" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
      </div>
      {paymentType !== '_donations' && (
        <>
          <div>
            <label htmlFor="shipping" className="block text-sm font-medium text-gray-700">Shipping</label>
            <input {...register('shipping', { valueAsNumber: true })} id="shipping" type="number" step="0.01" placeholder="0.00" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
            {errors.shipping && <p className="mt-1 text-sm text-red-600">{errors.shipping.message}</p>}
          </div>
          <div>
            <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax</label>
            <input {...register('tax', { valueAsNumber: true })} id="tax" type="number" step="0.01" placeholder="0.00" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
            {errors.tax && <p className="mt-1 text-sm text-red-600">{errors.tax.message}</p>}
          </div>
        </>
      )}
      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Expires At</label>
        <input {...register('expires_at')} id="expires_at" type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

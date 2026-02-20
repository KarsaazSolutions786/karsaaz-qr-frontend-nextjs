'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { brazilPixDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type BrazilPIXDataFormData = z.infer<typeof brazilPixDataSchema>

interface BrazilPIXDataFormProps {
  defaultValues?: BrazilPIXDataFormData
  onSubmit: (data: BrazilPIXDataFormData) => void
}

export function BrazilPIXDataForm({ defaultValues, onSubmit }: BrazilPIXDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BrazilPIXDataFormData>({
    resolver: zodResolver(brazilPixDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="key" className="block text-sm font-medium text-gray-700">PIX Key</label>
        <input {...register('key')} id="key" type="text" placeholder="CPF, CNPJ, email, phone or random key" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>}
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Recipient Name</label>
        <input {...register('name')} id="name" type="text" placeholder="Recipient full name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input {...register('city')} id="city" type="text" placeholder="e.g. São Paulo" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (BRL)</label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="0.01" placeholder="0.00" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700">Transaction ID</label>
        <input {...register('transaction_id')} id="transaction_id" type="text" placeholder="Optional transaction reference" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.transaction_id && <p className="mt-1 text-sm text-red-600">{errors.transaction_id.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <input {...register('message')} id="message" type="text" placeholder="Optional description" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>
    </form>
  )
}

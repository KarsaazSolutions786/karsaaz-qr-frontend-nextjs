'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { upiDynamicDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type UPIDynamicDataFormData = z.infer<typeof upiDynamicDataSchema>

interface UPIDynamicDataFormProps {
  defaultValues?: UPIDynamicDataFormData
  onSubmit: (data: UPIDynamicDataFormData) => void
}

export function UPIDynamicDataForm({ defaultValues, onSubmit }: UPIDynamicDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UPIDynamicDataFormData>({
    resolver: zodResolver(upiDynamicDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="payee_name" className="block text-sm font-medium text-gray-700">Payee Name</label>
        <input {...register('payee_name')} id="payee_name" type="text" placeholder="Recipient name" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.payee_name && <p className="mt-1 text-sm text-red-600">{errors.payee_name.message}</p>}
      </div>
      <div>
        <label htmlFor="upi_id" className="block text-sm font-medium text-gray-700">UPI ID</label>
        <input {...register('upi_id')} id="upi_id" type="text" placeholder="e.g. name@upi" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.upi_id && <p className="mt-1 text-sm text-red-600">{errors.upi_id.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" min="1" step="0.01" placeholder="0.00" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Expires At</label>
        <input {...register('expires_at')} id="expires_at" type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

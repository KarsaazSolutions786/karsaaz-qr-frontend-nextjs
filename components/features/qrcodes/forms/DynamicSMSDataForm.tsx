'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dynamicSMSDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type DynamicSMSDataFormData = z.infer<typeof dynamicSMSDataSchema>

interface DynamicSMSDataFormProps {
  defaultValues?: DynamicSMSDataFormData
  onSubmit: (data: DynamicSMSDataFormData) => void
}

export function DynamicSMSDataForm({ defaultValues, onSubmit }: DynamicSMSDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DynamicSMSDataFormData>({
    resolver: zodResolver(dynamicSMSDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input {...register('phone')} id="phone" type="text" placeholder="e.g. +1234567890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea {...register('message')} id="message" rows={3} placeholder="SMS message..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Expires At</label>
        <input {...register('expires_at')} id="expires_at" type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { smsDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type SMSDataFormData = z.infer<typeof smsDataSchema>

interface SMSDataFormProps {
  defaultValues?: SMSDataFormData
  onSubmit: (data: SMSDataFormData) => void
}

export function SMSDataForm({ defaultValues, onSubmit }: SMSDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SMSDataFormData>({
    resolver: zodResolver(smsDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input {...register('phone')} id="phone" type="tel" placeholder="+1234567890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea {...register('message')} id="message" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
    </form>
  )
}

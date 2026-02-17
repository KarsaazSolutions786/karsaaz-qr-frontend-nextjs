'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type PhoneDataFormData = z.infer<typeof phoneDataSchema>

interface PhoneDataFormProps {
  defaultValues?: PhoneDataFormData
  onSubmit: (data: PhoneDataFormData) => void
}

export function PhoneDataForm({ defaultValues, onSubmit }: PhoneDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PhoneDataFormData>({
    resolver: zodResolver(phoneDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input {...register('phone')} id="phone" type="tel" placeholder="+1234567890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
    </form>
  )
}

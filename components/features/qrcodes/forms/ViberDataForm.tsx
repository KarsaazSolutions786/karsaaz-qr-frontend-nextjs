'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { viberDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type ViberDataFormData = z.infer<typeof viberDataSchema>

interface ViberDataFormProps {
  defaultValues?: ViberDataFormData
  onSubmit: (data: ViberDataFormData) => void
}

export function ViberDataForm({ defaultValues, onSubmit }: ViberDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ViberDataFormData>({
    resolver: zodResolver(viberDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="viber_number" className="block text-sm font-medium text-gray-700">Viber Phone Number</label>
        <input {...register('viber_number')} id="viber_number" type="text" placeholder="e.g. +1234567890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.viber_number && <p className="mt-1 text-sm text-red-600">{errors.viber_number.message}</p>}
      </div>
    </form>
  )
}

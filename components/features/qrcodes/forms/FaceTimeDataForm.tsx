'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { facetimeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type FaceTimeDataFormData = z.infer<typeof facetimeDataSchema>

interface FaceTimeDataFormProps {
  defaultValues?: FaceTimeDataFormData
  onSubmit: (data: FaceTimeDataFormData) => void
}

export function FaceTimeDataForm({ defaultValues, onSubmit }: FaceTimeDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FaceTimeDataFormData>({
    resolver: zodResolver(facetimeDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="target" className="block text-sm font-medium text-gray-700">Email or Phone Number</label>
        <input {...register('target')} id="target" type="text" placeholder="e.g. user@example.com or +1234567890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>}
      </div>
    </form>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { locationDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type LocationDataFormData = z.infer<typeof locationDataSchema>

interface LocationDataFormProps {
  defaultValues?: LocationDataFormData
  onSubmit: (data: LocationDataFormData) => void
}

export function LocationDataForm({ defaultValues, onSubmit }: LocationDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LocationDataFormData>({
    resolver: zodResolver(locationDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude *</label>
          <input {...register('latitude', { valueAsNumber: true })} id="latitude" type="number" step="any" placeholder="37.7749" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>}
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude *</label>
          <input {...register('longitude', { valueAsNumber: true })} id="longitude" type="number" step="any" placeholder="-122.4194" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
        <input {...register('address')} id="address" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
    </form>
  )
}

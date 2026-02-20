'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { googleMapsDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type GoogleMapsDataFormData = z.infer<typeof googleMapsDataSchema>

interface GoogleMapsDataFormProps {
  defaultValues?: GoogleMapsDataFormData
  onSubmit: (data: GoogleMapsDataFormData) => void
}

export function GoogleMapsDataForm({ defaultValues, onSubmit }: GoogleMapsDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoogleMapsDataFormData>({
    resolver: zodResolver(googleMapsDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="googlemaps" className="block text-sm font-medium text-gray-700">Google Maps URL</label>
        <input {...register('googlemaps')} id="googlemaps" type="text" placeholder="e.g. https://maps.google.com/..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.googlemaps && <p className="mt-1 text-sm text-red-600">{errors.googlemaps.message}</p>}
      </div>
    </form>
  )
}

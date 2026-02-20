'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { googleReviewDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type GoogleReviewDataFormData = z.infer<typeof googleReviewDataSchema>

interface GoogleReviewDataFormProps {
  defaultValues?: GoogleReviewDataFormData
  onSubmit: (data: GoogleReviewDataFormData) => void
}

export function GoogleReviewDataForm({ defaultValues, onSubmit }: GoogleReviewDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoogleReviewDataFormData>({
    resolver: zodResolver(googleReviewDataSchema),
    defaultValues: { url_type: 'my-business', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="place" className="block text-sm font-medium text-gray-700">Google Place</label>
        <input {...register('place')} id="place" type="text" placeholder="Enter Google Place name or ID" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.place && <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>}
      </div>
      <div>
        <label htmlFor="url_type" className="block text-sm font-medium text-gray-700">URL Type</label>
        <select {...register('url_type')} id="url_type" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          <option value="my-business">Google My Business Page</option>
          <option value="review-list">Review List</option>
          <option value="review-request">Review Request</option>
        </select>
        {errors.url_type && <p className="mt-1 text-sm text-red-600">{errors.url_type.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Expires At</label>
        <input {...register('expires_at')} id="expires_at" type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zoomDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type ZoomDataFormData = z.infer<typeof zoomDataSchema>

interface ZoomDataFormProps {
  defaultValues?: ZoomDataFormData
  onSubmit: (data: ZoomDataFormData) => void
}

export function ZoomDataForm({ defaultValues, onSubmit }: ZoomDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ZoomDataFormData>({
    resolver: zodResolver(zoomDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="meeting_id" className="block text-sm font-medium text-gray-700">Meeting ID</label>
        <input {...register('meeting_id')} id="meeting_id" type="text" placeholder="e.g. 123 456 7890" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.meeting_id && <p className="mt-1 text-sm text-red-600">{errors.meeting_id.message}</p>}
      </div>
      <div>
        <label htmlFor="meeting_password" className="block text-sm font-medium text-gray-700">Meeting Password</label>
        <input {...register('meeting_password')} id="meeting_password" type="text" placeholder="Enter meeting password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.meeting_password && <p className="mt-1 text-sm text-red-600">{errors.meeting_password.message}</p>}
      </div>
    </form>
  )
}

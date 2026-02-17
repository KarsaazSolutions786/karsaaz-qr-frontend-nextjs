'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calendarDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type CalendarDataFormData = z.infer<typeof calendarDataSchema>

interface CalendarDataFormProps {
  defaultValues?: CalendarDataFormData
  onSubmit: (data: CalendarDataFormData) => void
}

export function CalendarDataForm({ defaultValues, onSubmit }: CalendarDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CalendarDataFormData>({
    resolver: zodResolver(calendarDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title *</label>
        <input {...register('title')} id="title" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time *</label>
          <input {...register('startTime')} id="startTime" type="datetime-local" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>}
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time *</label>
          <input {...register('endTime')} id="endTime" type="datetime-local" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
          {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input {...register('location')} id="location" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} id="description" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
    </form>
  )
}

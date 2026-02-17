'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { urlDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type URLDataFormData = z.infer<typeof urlDataSchema>

interface URLDataFormProps {
  defaultValues?: URLDataFormData
  onSubmit: (data: URLDataFormData) => void
}

export function URLDataForm({ defaultValues, onSubmit }: URLDataFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<URLDataFormData>({
    resolver: zodResolver(urlDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL *
        </label>
        <input
          {...register('url')}
          id="url"
          type="url"
          placeholder="https://example.com"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
      </div>
    </form>
  )
}

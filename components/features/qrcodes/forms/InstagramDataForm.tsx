'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { instagramDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type InstagramDataFormData = z.infer<typeof instagramDataSchema>

interface InstagramDataFormProps {
  defaultValues?: InstagramDataFormData
  onSubmit: (data: InstagramDataFormData) => void
}

export function InstagramDataForm({ defaultValues, onSubmit }: InstagramDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InstagramDataFormData>({
    resolver: zodResolver(instagramDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram Username or URL</label>
        <input {...register('instagram')} id="instagram" type="text" placeholder="e.g. @username or https://instagram.com/username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.instagram && <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>}
      </div>
    </form>
  )
}

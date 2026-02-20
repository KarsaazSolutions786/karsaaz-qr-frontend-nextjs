'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tiktokDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type TikTokDataFormData = z.infer<typeof tiktokDataSchema>

interface TikTokDataFormProps {
  defaultValues?: TikTokDataFormData
  onSubmit: (data: TikTokDataFormData) => void
}

export function TikTokDataForm({ defaultValues, onSubmit }: TikTokDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TikTokDataFormData>({
    resolver: zodResolver(tiktokDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">TikTok Username or URL</label>
        <input {...register('tiktok')} id="tiktok" type="text" placeholder="e.g. @username or https://tiktok.com/@username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.tiktok && <p className="mt-1 text-sm text-red-600">{errors.tiktok.message}</p>}
      </div>
    </form>
  )
}

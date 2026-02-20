'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { youtubeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type YouTubeDataFormData = z.infer<typeof youtubeDataSchema>

interface YouTubeDataFormProps {
  defaultValues?: YouTubeDataFormData
  onSubmit: (data: YouTubeDataFormData) => void
}

export function YouTubeDataForm({ defaultValues, onSubmit }: YouTubeDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<YouTubeDataFormData>({
    resolver: zodResolver(youtubeDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">YouTube Channel or Video URL</label>
        <input {...register('youtube')} id="youtube" type="text" placeholder="e.g. https://youtube.com/channel/..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.youtube && <p className="mt-1 text-sm text-red-600">{errors.youtube.message}</p>}
      </div>
    </form>
  )
}

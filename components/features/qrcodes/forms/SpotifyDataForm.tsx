'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { spotifyDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type SpotifyDataFormData = z.infer<typeof spotifyDataSchema>

interface SpotifyDataFormProps {
  defaultValues?: SpotifyDataFormData
  onSubmit: (data: SpotifyDataFormData) => void
}

export function SpotifyDataForm({ defaultValues, onSubmit }: SpotifyDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SpotifyDataFormData>({
    resolver: zodResolver(spotifyDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="spotify" className="block text-sm font-medium text-gray-700">Spotify URL</label>
        <input {...register('spotify')} id="spotify" type="text" placeholder="e.g. https://open.spotify.com/..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.spotify && <p className="mt-1 text-sm text-red-600">{errors.spotify.message}</p>}
      </div>
    </form>
  )
}

'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { spotifyDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type SpotifyDataFormData = z.infer<typeof spotifyDataSchema>
interface SpotifyDataFormProps { defaultValues?: Partial<SpotifyDataFormData>; onChange?: (data: Partial<SpotifyDataFormData>) => void }
export function SpotifyDataForm({ defaultValues, onChange }: SpotifyDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<SpotifyDataFormData>({ schema: spotifyDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="spotify" className={LABEL}>Spotify URL</label>
        <input {...register('spotify')} id="spotify" type="url" placeholder="https://open.spotify.com/track/..." className={INPUT} />
        {errors.spotify && <p className={ERROR}>{errors.spotify.message}</p>}
      </div>
    </form>
  )
}

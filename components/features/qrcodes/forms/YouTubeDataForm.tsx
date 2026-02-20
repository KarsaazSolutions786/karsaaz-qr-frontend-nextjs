'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { youtubeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type YouTubeDataFormData = z.infer<typeof youtubeDataSchema>
interface YouTubeDataFormProps { defaultValues?: Partial<YouTubeDataFormData>; onChange?: (data: Partial<YouTubeDataFormData>) => void }
export function YouTubeDataForm({ defaultValues, onChange }: YouTubeDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<YouTubeDataFormData>({ schema: youtubeDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="youtube" className={LABEL}>YouTube Channel URL or Username</label>
        <input {...register('youtube')} id="youtube" type="text" placeholder="https://youtube.com/@channel" className={INPUT} />
        {errors.youtube && <p className={ERROR}>{errors.youtube.message}</p>}
      </div>
    </form>
  )
}

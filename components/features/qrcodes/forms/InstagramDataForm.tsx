'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { instagramDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type InstagramDataFormData = z.infer<typeof instagramDataSchema>
interface InstagramDataFormProps { defaultValues?: Partial<InstagramDataFormData>; onChange?: (data: Partial<InstagramDataFormData>) => void }
export function InstagramDataForm({ defaultValues, onChange }: InstagramDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<InstagramDataFormData>({ schema: instagramDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="instagram" className={LABEL}>Instagram Username or URL</label>
        <input {...register('instagram')} id="instagram" type="text" placeholder="@username  or  https://instagram.com/username" className={INPUT} />
        {errors.instagram && <p className={ERROR}>{errors.instagram.message}</p>}
      </div>
    </form>
  )
}

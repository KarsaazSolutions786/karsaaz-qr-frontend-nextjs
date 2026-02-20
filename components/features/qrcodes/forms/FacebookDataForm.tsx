'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { facebookDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type FacebookDataFormData = z.infer<typeof facebookDataSchema>
interface FacebookDataFormProps { defaultValues?: Partial<FacebookDataFormData>; onChange?: (data: Partial<FacebookDataFormData>) => void }
export function FacebookDataForm({ defaultValues, onChange }: FacebookDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<FacebookDataFormData>({ schema: facebookDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="facebook" className={LABEL}>Facebook Page URL or Username</label>
        <input {...register('facebook')} id="facebook" type="text" placeholder="https://facebook.com/yourpage" className={INPUT} />
        {errors.facebook && <p className={ERROR}>{errors.facebook.message}</p>}
      </div>
    </form>
  )
}

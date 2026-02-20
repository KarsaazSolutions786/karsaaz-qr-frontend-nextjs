'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { facetimeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type FaceTimeDataFormData = z.infer<typeof facetimeDataSchema>
interface FaceTimeDataFormProps { defaultValues?: Partial<FaceTimeDataFormData>; onChange?: (data: Partial<FaceTimeDataFormData>) => void }
export function FaceTimeDataForm({ defaultValues, onChange }: FaceTimeDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<FaceTimeDataFormData>({ schema: facetimeDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="target" className={LABEL}>Phone Number or Apple ID Email</label>
        <input {...register('target')} id="target" type="text" placeholder="+1234567890 or user@icloud.com" className={INPUT} />
        {errors.target && <p className={ERROR}>{errors.target.message}</p>}
      </div>
    </form>
  )
}

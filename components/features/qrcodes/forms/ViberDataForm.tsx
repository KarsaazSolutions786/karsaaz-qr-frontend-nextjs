'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { viberDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type ViberDataFormData = z.infer<typeof viberDataSchema>
interface ViberDataFormProps { defaultValues?: Partial<ViberDataFormData>; onChange?: (data: Partial<ViberDataFormData>) => void }
export function ViberDataForm({ defaultValues, onChange }: ViberDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<ViberDataFormData>({ schema: viberDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="viber_number" className={LABEL}>Viber Phone Number</label>
        <input {...register('viber_number')} id="viber_number" type="tel" placeholder="+1 234 567 8900" className={INPUT} />
        {errors.viber_number && <p className={ERROR}>{errors.viber_number.message}</p>}
      </div>
    </form>
  )
}

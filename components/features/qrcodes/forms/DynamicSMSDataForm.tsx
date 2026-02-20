'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { dynamicSMSDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type DynamicSMSDataFormData = z.infer<typeof dynamicSMSDataSchema>
interface DynamicSMSDataFormProps { defaultValues?: Partial<DynamicSMSDataFormData>; onChange?: (data: Partial<DynamicSMSDataFormData>) => void }
export function DynamicSMSDataForm({ defaultValues, onChange }: DynamicSMSDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<DynamicSMSDataFormData>({ schema: dynamicSMSDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="phone" className={LABEL}>Phone Number</label>
        <input {...register('phone')} id="phone" type="tel" placeholder="+1 234 567 8900" className={INPUT} />
        {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className={LABEL}>Message</label>
        <textarea {...register('message')} id="message" rows={3} placeholder="Pre-filled message..." className={TEXTAREA} />
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

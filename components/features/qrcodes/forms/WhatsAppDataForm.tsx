'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { whatsappDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type WhatsAppDataFormData = z.infer<typeof whatsappDataSchema>
interface WhatsAppDataFormProps {
  defaultValues?: Partial<WhatsAppDataFormData>
  onChange?: (data: Partial<WhatsAppDataFormData>) => void
}

export function WhatsAppDataForm({ defaultValues, onChange }: WhatsAppDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<WhatsAppDataFormData>({
    schema: whatsappDataSchema, defaultValues, onChange,
  })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="mobile_number" className={LABEL}>WhatsApp Number</label>
        <input {...register('mobile_number')} id="mobile_number" type="tel"
          placeholder="+1 234 567 8900 (include country code)" className={INPUT} />
        {errors.mobile_number && <p className={ERROR}>{errors.mobile_number.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className={LABEL}>Pre-filled Message <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea {...register('message')} id="message" rows={3}
          placeholder="Hi! I found your QR code..." className={TEXTAREA} />
      </div>
    </form>
  )
}

'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { leadFormDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type LeadFormData = z.infer<typeof leadFormDataSchema>
interface LeadFormDataFormProps { defaultValues?: Partial<LeadFormData>; onChange?: (data: Partial<LeadFormData>) => void }
export function LeadFormDataForm({ defaultValues, onChange }: LeadFormDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<LeadFormData>({ schema: leadFormDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="form_name" className={LABEL}>Form Name *</label>
        <input {...register('form_name')} id="form_name" type="text" placeholder="Feedback Collection" className={INPUT} />
        {errors.form_name && <p className={ERROR}>{errors.form_name.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700">
        📝 After creating the QR code, you can configure the form fields and design in the Lead Forms section of the dashboard.
      </div>
    </form>
  )
}

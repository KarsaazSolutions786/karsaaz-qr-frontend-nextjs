'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { biolinksDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type BiolinksData = z.infer<typeof biolinksDataSchema>
interface BiolinksDataFormProps { defaultValues?: Partial<BiolinksData>; onChange?: (data: Partial<BiolinksData>) => void }
export function BiolinksDataForm({ defaultValues, onChange }: BiolinksDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<BiolinksData>({ schema: biolinksDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="page_name" className={LABEL}>Page Name *</label>
        <input {...register('page_name')} id="page_name" type="text" placeholder="My Bio Link Page" className={INPUT} />
        {errors.page_name && <p className={ERROR}>{errors.page_name.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700">
        🔗 After creating the QR code, use the full Biolinks editor to add blocks, customize themes, and manage your bio link page.
      </div>
    </form>
  )
}

'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { upiStaticDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type UPIStaticData = z.infer<typeof upiStaticDataSchema>
interface UPIStaticDataFormProps { defaultValues?: Partial<UPIStaticData>; onChange?: (data: Partial<UPIStaticData>) => void }
export function UPIStaticDataForm({ defaultValues, onChange }: UPIStaticDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<UPIStaticData>({ schema: upiStaticDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="payee_name" className={LABEL}>Payee Name *</label>
        <input {...register('payee_name')} id="payee_name" type="text" placeholder="John Doe" className={INPUT} />
        {errors.payee_name && <p className={ERROR}>{errors.payee_name.message}</p>}
      </div>
      <div>
        <label htmlFor="upi_id" className={LABEL}>UPI ID *</label>
        <input {...register('upi_id')} id="upi_id" type="text" placeholder="name@upi" className={INPUT} />
        {errors.upi_id && <p className={ERROR}>{errors.upi_id.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className={LABEL}>Amount (optional)</label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" min={1} placeholder="100" className={INPUT} />
        {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
      </div>
    </form>
  )
}

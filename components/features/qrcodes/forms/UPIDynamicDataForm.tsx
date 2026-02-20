'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { upiDynamicDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type UPIDynamicDataFormData = z.infer<typeof upiDynamicDataSchema>
interface UPIDynamicDataFormProps { defaultValues?: Partial<UPIDynamicDataFormData>; onChange?: (data: Partial<UPIDynamicDataFormData>) => void }
export function UPIDynamicDataForm({ defaultValues, onChange }: UPIDynamicDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<UPIDynamicDataFormData>({ schema: upiDynamicDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="payee_name" className={LABEL}>Payee Name</label>
        <input {...register('payee_name')} id="payee_name" type="text" className={INPUT} />
        {errors.payee_name && <p className={ERROR}>{errors.payee_name.message}</p>}
      </div>
      <div>
        <label htmlFor="upi_id" className={LABEL}>UPI ID</label>
        <input {...register('upi_id')} id="upi_id" type="text" placeholder="name@upi" className={INPUT} />
        {errors.upi_id && <p className={ERROR}>{errors.upi_id.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className={LABEL}>Amount <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="0.01" placeholder="0.00" className={INPUT} />
        {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expires At <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
        {errors.expires_at && <p className={ERROR}>{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

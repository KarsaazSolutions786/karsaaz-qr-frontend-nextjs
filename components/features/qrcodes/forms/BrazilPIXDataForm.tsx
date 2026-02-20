'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { brazilPixDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type BrazilPIXDataFormData = z.infer<typeof brazilPixDataSchema>
interface BrazilPIXDataFormProps { defaultValues?: Partial<BrazilPIXDataFormData>; onChange?: (data: Partial<BrazilPIXDataFormData>) => void }
export function BrazilPIXDataForm({ defaultValues, onChange }: BrazilPIXDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<BrazilPIXDataFormData>({ schema: brazilPixDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="key" className={LABEL}>PIX Key</label>
        <input {...register('key')} id="key" type="text" placeholder="CPF, CNPJ, phone, email or random key" className={INPUT} />
        {errors.key && <p className={ERROR}>{errors.key.message}</p>}
      </div>
      <div>
        <label htmlFor="name" className={LABEL}>Recipient Name</label>
        <input {...register('name')} id="name" type="text" className={INPUT} />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="city" className={LABEL}>City</label>
        <input {...register('city')} id="city" type="text" className={INPUT} />
        {errors.city && <p className={ERROR}>{errors.city.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className={LABEL}>Amount <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="0.01" placeholder="0.00" className={INPUT} />
        {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="transaction_id" className={LABEL}>Transaction ID <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('transaction_id')} id="transaction_id" type="text" className={INPUT} />
        {errors.transaction_id && <p className={ERROR}>{errors.transaction_id.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className={LABEL}>Message <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('message')} id="message" type="text" className={INPUT} />
        {errors.message && <p className={ERROR}>{errors.message.message}</p>}
      </div>
    </form>
  )
}

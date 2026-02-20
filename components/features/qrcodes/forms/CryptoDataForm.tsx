'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { cryptoDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type CryptoDataFormData = z.infer<typeof cryptoDataSchema>
interface CryptoDataFormProps { defaultValues?: Partial<CryptoDataFormData>; onChange?: (data: Partial<CryptoDataFormData>) => void }
export function CryptoDataForm({ defaultValues, onChange }: CryptoDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<CryptoDataFormData>({ schema: cryptoDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="coin" className={LABEL}>Coin</label>
        <select {...register('coin')} id="coin" className={SELECT}>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="litecoin">Litecoin</option>
          <option value="bitcoincash">Bitcoin Cash</option>
        </select>
        {errors.coin && <p className={ERROR}>{errors.coin.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className={LABEL}>Wallet Address</label>
        <input {...register('address')} id="address" type="text" className={INPUT} />
        {errors.address && <p className={ERROR}>{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className={LABEL}>Amount <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="any" className={INPUT} />
        {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className={LABEL}>Message <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('message')} id="message" type="text" className={INPUT} />
        {errors.message && <p className={ERROR}>{errors.message.message}</p>}
      </div>
    </form>
  )
}

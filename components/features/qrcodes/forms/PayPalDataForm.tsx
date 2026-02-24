'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { paypalDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type PayPalDataFormData = z.infer<typeof paypalDataSchema>
interface PayPalDataFormProps {
  defaultValues?: Partial<PayPalDataFormData>
  onChange?: (data: Partial<PayPalDataFormData>) => void
}
export function PayPalDataForm({ defaultValues, onChange }: PayPalDataFormProps) {
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<PayPalDataFormData>({ schema: paypalDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="type" className={LABEL}>
          Type
        </label>
        <select {...register('type')} id="type" className={SELECT}>
          <option value="_xclick">Buy Now</option>
          <option value="_donations">Donate</option>
          <option value="_cart">Add to Cart</option>
        </select>
        {errors.type && <p className={ERROR}>{errors.type.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className={LABEL}>
          PayPal Email
        </label>
        <input {...register('email')} id="email" type="email" className={INPUT} />
        {errors.email && <p className={ERROR}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="item_name" className={LABEL}>
          Item Name <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input {...register('item_name')} id="item_name" type="text" className={INPUT} />
        {errors.item_name && <p className={ERROR}>{errors.item_name.message}</p>}
      </div>
      <div>
        <label htmlFor="item_id" className={LABEL}>
          Item ID <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input {...register('item_id')} id="item_id" type="text" className={INPUT} />
      </div>
      <div>
        <label htmlFor="amount" className={LABEL}>
          Amount <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          className={INPUT}
        />
        {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="currency" className={LABEL}>
          Currency
        </label>
        <select {...register('currency')} id="currency" className={SELECT}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        {errors.currency && <p className={ERROR}>{errors.currency.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="shipping" className={LABEL}>
            Shipping <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            {...register('shipping', { valueAsNumber: true })}
            id="shipping"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="tax" className={LABEL}>
            Tax Rate % <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            {...register('tax', { valueAsNumber: true })}
            id="tax"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={INPUT}
          />
        </div>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          Expires At <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
        {errors.expires_at && <p className={ERROR}>{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

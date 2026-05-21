'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
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

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '\u20ac' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '\u00a3' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'INR', label: 'INR - Indian Rupee', symbol: '\u20b9' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '\u00a5' },
  { value: 'BRL', label: 'BRL - Brazilian Real', symbol: 'R$' },
  { value: 'CHF', label: 'CHF - Swiss Franc', symbol: 'CHF' },
  { value: 'SGD', label: 'SGD - Singapore Dollar', symbol: 'S$' },
  { value: 'MXN', label: 'MXN - Mexican Peso', symbol: 'MX$' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar', symbol: 'NZ$' },
  { value: 'SEK', label: 'SEK - Swedish Krona', symbol: 'kr' },
  { value: 'NOK', label: 'NOK - Norwegian Krone', symbol: 'kr' },
  { value: 'DKK', label: 'DKK - Danish Krone', symbol: 'kr' },
  { value: 'PLN', label: 'PLN - Polish Zloty', symbol: 'z\u0142' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar', symbol: 'HK$' },
  { value: 'TWD', label: 'TWD - Taiwan Dollar', symbol: 'NT$' },
  { value: 'THB', label: 'THB - Thai Baht', symbol: '\u0e3f' },
  { value: 'PHP', label: 'PHP - Philippine Peso', symbol: '\u20b1' },
]

/**
 * Purpose: Executes PayPalDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function PayPalDataForm({ defaultValues, onChange }: PayPalDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    watch,
    formState: { errors },
  } = useQRFormWatch<PayPalDataFormData>({ schema: paypalDataSchema, defaultValues, onChange })

  const paymentType = watch('type')

  return (
    <form className="space-y-5">
      {/* Payment Type */}
      <div>
        <label htmlFor="type" className={LABEL}>
          {t('Payment Type')} *
        </label>
        <select {...register('type')} id="type" className={SELECT}>
          <option value="_xclick">{t('Buy Now - One-time purchase')}</option>
          <option value="_donations">{t('Donate - Accept donations')}</option>
          <option value="_cart">{t('Add to Cart - Multi-item cart')}</option>
        </select>
        {errors.type && <p className={ERROR}>{errors.type.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {paymentType === '_donations'
            ? t('Users will be taken to PayPal to make a donation')
            : paymentType === '_cart'
              ? t('Users can add this item to their PayPal shopping cart')
              : t('Users will be taken to PayPal for immediate purchase')}
        </p>
      </div>

      {/* PayPal Email */}
      <div>
        <label htmlFor="email" className={LABEL}>
          {t('PayPal Email')} *
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="payments@yourbusiness.com"
          className={INPUT}
        />
        {errors.email && <p className={ERROR}>{errors.email.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {t('The PayPal account email that will receive payments')}
        </p>
      </div>

      {/* Item Name */}
      <div>
        <label htmlFor="item_name" className={LABEL}>
          {t('Item Name')}{' '}
          <span className="text-gray-400 font-normal">({t('optional')})</span>
        </label>
        <input
          {...register('item_name')}
          id="item_name"
          type="text"
          placeholder={
            paymentType === '_donations'
              ? t('Donation to...')
              : t('Product or service name')
          }
          className={INPUT}
        />
        {errors.item_name && <p className={ERROR}>{errors.item_name.message}</p>}
      </div>

      {/* Item ID */}
      <div>
        <label htmlFor="item_id" className={LABEL}>
          {t('Item ID / SKU')}{' '}
          <span className="text-gray-400 font-normal">({t('optional')})</span>
        </label>
        <input
          {...register('item_id')}
          id="item_id"
          type="text"
          placeholder="SKU-001"
          className={INPUT}
        />
      </div>

      {/* Amount and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="amount" className={LABEL}>
            {t('Amount')}{' '}
            <span className="text-gray-400 font-normal">({t('optional')})</span>
          </label>
          <input
            {...register('amount', { valueAsNumber: true })}
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={INPUT}
          />
          {errors.amount && <p className={ERROR}>{errors.amount.message}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {t('Leave empty to let the payer enter the amount')}
          </p>
        </div>
        <div>
          <label htmlFor="currency" className={LABEL}>
            {t('Currency')}
          </label>
          <select {...register('currency')} id="currency" className={SELECT}>
            {CURRENCY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.currency && <p className={ERROR}>{errors.currency.message}</p>}
        </div>
      </div>

      {/* Shipping and Tax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="shipping" className={LABEL}>
            {t('Shipping Cost')}{' '}
            <span className="text-gray-400 font-normal">({t('optional')})</span>
          </label>
          <input
            {...register('shipping', { valueAsNumber: true })}
            id="shipping"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="tax" className={LABEL}>
            {t('Tax Rate %')}{' '}
            <span className="text-gray-400 font-normal">({t('optional')})</span>
          </label>
          <input
            {...register('tax', { valueAsNumber: true })}
            id="tax"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0.00"
            className={INPUT}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-green-900">{t('Secure Payments')}</h4>
            <p className="text-xs text-green-700 mt-1">
              {t(
                'All payments are processed securely through PayPal. No payment information is stored on our servers.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          {t('Expires At')}{' '}
          <span className="text-gray-400 font-normal">({t('optional')})</span>
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
        {errors.expires_at && <p className={ERROR}>{errors.expires_at.message}</p>}
      </div>
    </form>
  )
}

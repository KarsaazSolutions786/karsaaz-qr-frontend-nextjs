'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { dynamicEmailDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type DynamicEmailDataFormData = z.infer<typeof dynamicEmailDataSchema>
interface DynamicEmailDataFormProps { defaultValues?: Partial<DynamicEmailDataFormData>; onChange?: (data: Partial<DynamicEmailDataFormData>) => void }
/**
 * Purpose: Executes DynamicEmailDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function DynamicEmailDataForm({ defaultValues, onChange }: DynamicEmailDataFormProps) {
  const { t } = useTranslation()
  const { register, formState: { errors } } = useQRFormWatch<DynamicEmailDataFormData>({ schema: dynamicEmailDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="email" className={LABEL}>{t('Email Address')}</label>
        <input {...register('email')} id="email" type="email" placeholder="recipient@example.com" className={INPUT} />
        {errors.email && <p className={ERROR}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="subject" className={LABEL}>{t('Subject')}</label>
        <input {...register('subject')} id="subject" type="text" placeholder={t('Email subject')} className={INPUT} />
      </div>
      <div>
        <label htmlFor="message" className={LABEL}>{t('Message')}</label>
        <textarea {...register('message')} id="message" rows={4} placeholder={t('Email body...')} className={TEXTAREA} />
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>{t('Expiry Date')}</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

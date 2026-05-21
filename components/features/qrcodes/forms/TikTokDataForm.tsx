'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { tiktokDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type TikTokDataFormData = z.infer<typeof tiktokDataSchema>
interface TikTokDataFormProps { defaultValues?: Partial<TikTokDataFormData>; onChange?: (data: Partial<TikTokDataFormData>) => void }
/**
 * Purpose: Executes TikTokDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function TikTokDataForm({ defaultValues, onChange }: TikTokDataFormProps) {
  const { t } = useTranslation()
  const { register, formState: { errors } } = useQRFormWatch<TikTokDataFormData>({ schema: tiktokDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="tiktok" className={LABEL}>{t('TikTok Username or URL')}</label>
        <input {...register('tiktok')} id="tiktok" type="text" placeholder="@username or https://tiktok.com/@username" className={INPUT} />
        {errors.tiktok && <p className={ERROR}>{errors.tiktok.message}</p>}
      </div>
    </form>
  )
}

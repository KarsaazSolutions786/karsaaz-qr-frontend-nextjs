'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { zoomDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type ZoomDataFormData = z.infer<typeof zoomDataSchema>
interface ZoomDataFormProps { defaultValues?: Partial<ZoomDataFormData>; onChange?: (data: Partial<ZoomDataFormData>) => void }
export function ZoomDataForm({ defaultValues, onChange }: ZoomDataFormProps) {
  const { t } = useTranslation()
  const { register, formState: { errors } } = useQRFormWatch<ZoomDataFormData>({ schema: zoomDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="meeting_id" className={LABEL}>{t('Meeting ID')}</label>
        <input {...register('meeting_id')} id="meeting_id" type="text" placeholder="123 456 7890" className={INPUT} />
        {errors.meeting_id && <p className={ERROR}>{errors.meeting_id.message}</p>}
      </div>
      <div>
        <label htmlFor="meeting_password" className={LABEL}>{t('Meeting Password')}</label>
        <input {...register('meeting_password')} id="meeting_password" type="text" placeholder={t('Optional password')} className={INPUT} />
      </div>
    </form>
  )
}

'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { facebookMessengerDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type FacebookMessengerDataFormData = z.infer<typeof facebookMessengerDataSchema>
interface FacebookMessengerDataFormProps { defaultValues?: Partial<FacebookMessengerDataFormData>; onChange?: (data: Partial<FacebookMessengerDataFormData>) => void }
export function FacebookMessengerDataForm({ defaultValues, onChange }: FacebookMessengerDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<FacebookMessengerDataFormData>({ schema: facebookMessengerDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="facebook_page_name" className={LABEL}>Facebook Page Name or URL</label>
        <input {...register('facebook_page_name')} id="facebook_page_name" type="text" placeholder="e.g. YourPageName or https://m.me/pagename" className={INPUT} />
        {errors.facebook_page_name && <p className={ERROR}>{errors.facebook_page_name.message}</p>}
      </div>
    </form>
  )
}

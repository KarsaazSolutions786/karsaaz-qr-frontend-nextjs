'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { websiteBuilderDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type WebsiteBuilderData = z.infer<typeof websiteBuilderDataSchema>
interface WebsiteBuilderDataFormProps { defaultValues?: Partial<WebsiteBuilderData>; onChange?: (data: Partial<WebsiteBuilderData>) => void }
export function WebsiteBuilderDataForm({ defaultValues, onChange }: WebsiteBuilderDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<WebsiteBuilderData>({ schema: websiteBuilderDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="website_name" className={LABEL}>Website Name *</label>
        <input {...register('website_name')} id="website_name" type="text" placeholder="My new website" className={INPUT} />
        {errors.website_name && <p className={ERROR}>{errors.website_name.message}</p>}
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700">
        🌐 After creating the QR code, you can build out your website pages with the full website builder editor.
      </div>
    </form>
  )
}

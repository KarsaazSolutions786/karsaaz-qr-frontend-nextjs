'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { googleReviewDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type GoogleReviewDataFormData = z.infer<typeof googleReviewDataSchema>
interface GoogleReviewDataFormProps { defaultValues?: Partial<GoogleReviewDataFormData>; onChange?: (data: Partial<GoogleReviewDataFormData>) => void }
export function GoogleReviewDataForm({ defaultValues, onChange }: GoogleReviewDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<GoogleReviewDataFormData>({ schema: googleReviewDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="place" className={LABEL}>Google Business Place ID or URL</label>
        <input {...register('place')} id="place" type="text" placeholder="ChIJ... or https://g.page/..." className={INPUT} />
        {errors.place && <p className={ERROR}>{errors.place.message}</p>}
      </div>
      <div>
        <label htmlFor="url_type" className={LABEL}>Review Link Type</label>
        <select {...register('url_type')} id="url_type" className={SELECT}>
          <option value="my-business">My Business</option>
          <option value="review-list">Review List</option>
          <option value="review-request">Review Request</option>
        </select>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

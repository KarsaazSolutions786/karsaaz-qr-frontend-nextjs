'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { businessReviewDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type BusinessReviewData = z.infer<typeof businessReviewDataSchema>
interface BusinessReviewDataFormProps { defaultValues?: Partial<BusinessReviewData>; onChange?: (data: Partial<BusinessReviewData>) => void }
export function BusinessReviewDataForm({ defaultValues, onChange }: BusinessReviewDataFormProps) {
  const { register, watch, formState: { errors } } = useQRFormWatch<BusinessReviewData>({ schema: businessReviewDataSchema, defaultValues, onChange })
  const action = watch('action')
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="businessName" className={LABEL}>Business Name *</label>
        <input {...register('businessName')} id="businessName" type="text" placeholder="My Business" className={INPUT} />
        {errors.businessName && <p className={ERROR}>{errors.businessName.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="totalNumberOfStars" className={LABEL}>Total Stars</label>
          <input {...register('totalNumberOfStars', { valueAsNumber: true })} id="totalNumberOfStars" type="number" min={1} defaultValue={5} className={INPUT} />
        </div>
        <div>
          <label htmlFor="numberOfStarsToRedirect" className={LABEL}>Stars to Redirect</label>
          <input {...register('numberOfStarsToRedirect', { valueAsNumber: true })} id="numberOfStarsToRedirect" type="number" min={1} defaultValue={3} className={INPUT} />
          <p className="mt-1 text-xs text-gray-500">Redirect to review page if rating is ≥ this number</p>
        </div>
      </div>
      <div>
        <label htmlFor="action" className={LABEL}>Review Action</label>
        <select {...register('action')} id="action" className={SELECT}>
          <option value="google_review">Google Review</option>
          <option value="review_url">Custom Review URL</option>
        </select>
      </div>
      {action === 'google_review' && (
        <div>
          <label htmlFor="google_place" className={LABEL}>Google Place ID or URL</label>
          <input {...register('google_place')} id="google_place" type="text" placeholder="ChIJ... or https://g.page/..." className={INPUT} />
        </div>
      )}
      {action === 'review_url' && (
        <div>
          <label htmlFor="review_url" className={LABEL}>Review URL</label>
          <input {...register('review_url')} id="review_url" type="url" placeholder="https://..." className={INPUT} />
          {errors.review_url && <p className={ERROR}>{errors.review_url.message}</p>}
        </div>
      )}
      <div>
        <label htmlFor="show_final_review_link" className={LABEL}>Show Final Review Link</label>
        <select {...register('show_final_review_link')} id="show_final_review_link" className={SELECT}>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

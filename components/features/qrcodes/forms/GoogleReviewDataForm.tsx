'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { googleReviewDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-[80px]'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type GoogleReviewDataFormData = z.infer<typeof googleReviewDataSchema>

interface GoogleReviewDataFormProps {
  defaultValues?: Partial<GoogleReviewDataFormData>
  onChange?: (data: Partial<GoogleReviewDataFormData>) => void
}

/**
 * Purpose: Executes GoogleReviewDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function GoogleReviewDataForm({ defaultValues, onChange }: GoogleReviewDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<GoogleReviewDataFormData>({
    schema: googleReviewDataSchema,
    defaultValues,
    onChange,
  })

  return (
    <form className="space-y-5">
      {/* Business Name */}
      <div>
        <label htmlFor="business_name" className={LABEL}>
          {t('Business Name')}
        </label>
        <input
          {...register('business_name')}
          id="business_name"
          type="text"
          placeholder={t('My Business')}
          className={INPUT}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('The name displayed on the review prompt page')}
        </p>
      </div>

      {/* Google Place ID or URL */}
      <div>
        <label htmlFor="place" className={LABEL}>
          {t('Google Business Place ID or URL')} *
        </label>
        <input
          {...register('place')}
          id="place"
          type="text"
          placeholder="ChIJ... or https://g.page/..."
          className={INPUT}
        />
        {errors.place && <p className={ERROR}>{errors.place.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {t('Find your Place ID at')}{' '}
          <a
            href="https://developers.google.com/maps/documentation/places/web-service/place-id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Google Place ID Finder
          </a>
        </p>
      </div>

      {/* Review Link Type */}
      <div>
        <label htmlFor="url_type" className={LABEL}>
          {t('Review Link Type')}
        </label>
        <select {...register('url_type')} id="url_type" className={SELECT}>
          <option value="my-business">{t('My Business')}</option>
          <option value="review-list">{t('Review List')}</option>
          <option value="review-request">{t('Review Request')}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {t('Choose which type of Google review page to link to')}
        </p>
      </div>

      {/* Custom Message */}
      <div>
        <label htmlFor="custom_message" className={LABEL}>
          {t('Custom Message')}
        </label>
        <textarea
          {...register('custom_message')}
          id="custom_message"
          placeholder={t('Your feedback helps us improve...')}
          className={TEXTAREA}
          rows={3}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('Message shown on the review prompt page before redirect')}
        </p>
      </div>

      {/* Star Rating Prompt */}
      <div>
        <label htmlFor="star_rating_prompt" className={LABEL}>
          {t('Star Rating Prompt')}
        </label>
        <select {...register('star_rating_prompt')} id="star_rating_prompt" className={SELECT}>
          <option value="0">{t('No star prompt')}</option>
          <option value="4">4 {t('Stars')}</option>
          <option value="5">5 {t('Stars')}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {t('Show a star rating suggestion on the prompt page')}
        </p>
      </div>

      {/* Tips Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-2">{t('Tips for More Reviews')}</h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>{t('Place QR codes on receipts and invoices')}</li>
          <li>{t('Display on table tents or counter displays')}</li>
          <li>{t('Include in follow-up emails')}</li>
          <li>{t('Add to business cards')}</li>
        </ul>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          {t('Expiry Date')}
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

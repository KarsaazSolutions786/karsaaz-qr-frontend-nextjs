'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { businessReviewDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type BusinessReviewData = z.infer<typeof businessReviewDataSchema>

interface BusinessReviewDataFormProps {
  defaultValues?: Partial<BusinessReviewData>
  onChange?: (data: Partial<BusinessReviewData>) => void
}

interface PlatformEntry {
  platform: string
  url: string
}

const PLATFORM_OPTIONS = [
  { value: 'Google', label: 'Google' },
  { value: 'Yelp', label: 'Yelp' },
  { value: 'TripAdvisor', label: 'TripAdvisor' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Trustpilot', label: 'Trustpilot' },
  { value: 'Amazon', label: 'Amazon' },
  { value: 'Other', label: 'Other' },
]

export function BusinessReviewDataForm({ defaultValues, onChange }: BusinessReviewDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    watch,
    formState: { errors },
  } = useQRFormWatch<BusinessReviewData>({
    schema: businessReviewDataSchema,
    defaultValues,
    onChange,
  })

  const action = watch('action')

  const [platforms, setPlatforms] = useState<PlatformEntry[]>(
    (defaultValues as any)?.platforms || []
  )

  const addPlatform = () => {
    const updated = [...platforms, { platform: 'Google', url: '' }]
    setPlatforms(updated)
    onChange?.({ ...(defaultValues as any), platforms: updated })
  }

  const removePlatform = (index: number) => {
    const updated = platforms.filter((_, i) => i !== index)
    setPlatforms(updated)
    onChange?.({ ...(defaultValues as any), platforms: updated })
  }

  const updatePlatform = (index: number, field: keyof PlatformEntry, value: string) => {
    const updated = platforms.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    setPlatforms(updated)
    onChange?.({ ...(defaultValues as any), platforms: updated })
  }

  return (
    <form className="space-y-5">
      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className={LABEL}>
          {t('Business Name')} *
        </label>
        <input
          {...register('businessName')}
          id="businessName"
          type="text"
          placeholder={t('My Business')}
          className={INPUT}
        />
        {errors.businessName && <p className={ERROR}>{errors.businessName.message}</p>}
      </div>

      {/* Star Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="totalNumberOfStars" className={LABEL}>
            {t('Total Stars')}
          </label>
          <input
            {...register('totalNumberOfStars', { valueAsNumber: true })}
            id="totalNumberOfStars"
            type="number"
            min={1}
            max={10}
            defaultValue={5}
            className={INPUT}
          />
          <p className="mt-1 text-xs text-gray-500">{t('Maximum number of stars (default: 5)')}</p>
        </div>
        <div>
          <label htmlFor="numberOfStarsToRedirect" className={LABEL}>
            {t('Stars to Redirect')}
          </label>
          <input
            {...register('numberOfStarsToRedirect', { valueAsNumber: true })}
            id="numberOfStarsToRedirect"
            type="number"
            min={1}
            defaultValue={3}
            className={INPUT}
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Redirect to review page if rating is >= this number')}
          </p>
        </div>
      </div>

      {/* Review Action */}
      <div>
        <label htmlFor="action" className={LABEL}>
          {t('Review Action')}
        </label>
        <select {...register('action')} id="action" className={SELECT}>
          <option value="google_review">{t('Google Review')}</option>
          <option value="review_url">{t('Custom Review URL')}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {t('Where to redirect users with high ratings')}
        </p>
      </div>

      {/* Google Place ID (conditional) */}
      {action === 'google_review' && (
        <div>
          <label htmlFor="google_place" className={LABEL}>
            {t('Google Place ID or URL')}
          </label>
          <input
            {...register('google_place')}
            id="google_place"
            type="text"
            placeholder="ChIJ... or https://g.page/..."
            className={INPUT}
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Enter your Google Place ID or Google Maps review URL')}
          </p>
        </div>
      )}

      {/* Custom Review URL (conditional) */}
      {action === 'review_url' && (
        <div>
          <label htmlFor="review_url" className={LABEL}>
            {t('Review URL')}
          </label>
          <input
            {...register('review_url')}
            id="review_url"
            type="url"
            placeholder="https://..."
            className={INPUT}
          />
          {errors.review_url && <p className={ERROR}>{errors.review_url.message}</p>}
        </div>
      )}

      {/* Show Final Review Link */}
      <div>
        <label htmlFor="show_final_review_link" className={LABEL}>
          {t('Show Final Review Link')}
        </label>
        <select
          {...register('show_final_review_link')}
          id="show_final_review_link"
          className={SELECT}
        >
          <option value="enabled">{t('Enabled')}</option>
          <option value="disabled">{t('Disabled')}</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {t('Show the review platform link on the feedback page')}
        </p>
      </div>

      {/* Review Platforms Section */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL}>{t('Review Platforms')}</label>
          <button
            type="button"
            onClick={addPlatform}
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('Add Platform')}
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {t('Add links to review platforms where users can leave reviews')}
        </p>

        {platforms.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-400">
            {t('No review platforms added yet')}
          </div>
        )}

        <div className="space-y-3">
          {platforms.map((platform, index) => (
            <div key={index} className="flex gap-2 items-start">
              <select
                value={platform.platform}
                onChange={e => updatePlatform(index, 'platform', e.target.value)}
                className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              >
                {PLATFORM_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={platform.url}
                onChange={e => updatePlatform(index, 'url', e.target.value)}
                placeholder={`https://${platform.platform.toLowerCase()}.com/...`}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="button"
                onClick={() => removePlatform(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
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

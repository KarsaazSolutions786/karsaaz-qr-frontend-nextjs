'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { businessProfileDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-[80px]'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type BusinessProfileData = z.infer<typeof businessProfileDataSchema>
interface BusinessProfileDataFormProps {
  defaultValues?: Partial<BusinessProfileData>
  onChange?: (data: Partial<BusinessProfileData>) => void
}
/**
 * Purpose: Executes BusinessProfileDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function BusinessProfileDataForm({ defaultValues, onChange }: BusinessProfileDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<BusinessProfileData>({
    schema: businessProfileDataSchema,
    defaultValues,
    onChange,
  })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="business_type" className={LABEL}>
          {t('Business Type')}
        </label>
        <select {...register('business_type')} id="business_type" className={SELECT}>
          <option value="bakery">{t('Bakery')}</option>
          <option value="healthcare">{t('Healthcare')}</option>
          <option value="restaurant">{t('Restaurant')}</option>
          <option value="plumber">{t('Plumber')}</option>
          <option value="barber">{t('Barber')}</option>
          <option value="electrician">{t('Electrician')}</option>
          <option value="builder">{t('Builder')}</option>
          <option value="gardener">{t('Gardener')}</option>
          <option value="cafe">{t('Cafe')}</option>
          <option value="mechanic">{t('Mechanic')}</option>
          <option value="garage">{t('Garage')}</option>
          <option value="joiner">{t('Joiner')}</option>
          <option value="car_valeter">{t('Car Valeter')}</option>
          <option value="painter">{t('Painter')}</option>
          <option value="plasterer">{t('Plasterer')}</option>
          <option value="cleaner">{t('Cleaner')}</option>
          <option value="roofer">{t('Roofer')}</option>
          <option value="accountant">{t('Accountant')}</option>
          <option value="lawyer">{t('Lawyer')}</option>
          <option value="other">{t('Other')}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="business_name" className={LABEL}>
            {t('Business Name')} *
          </label>
          <input
            {...register('business_name')}
            id="business_name"
            type="text"
            placeholder={t('My Business')}
            className={INPUT}
          />
          {errors.business_name && <p className={ERROR}>{errors.business_name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            {t('Phone')}
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="text"
            placeholder="+1 234 567 890"
            className={INPUT}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={LABEL}>
            {t('Email')}
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="info@business.com"
            className={INPUT}
          />
          {errors.email && <p className={ERROR}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="website" className={LABEL}>
            {t('Website')}
          </label>
          <input
            {...register('website')}
            id="website"
            type="url"
            placeholder="https://mybusiness.com"
            className={INPUT}
          />
          {errors.website && <p className={ERROR}>{errors.website.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="address" className={LABEL}>
          {t('Address')}
        </label>
        <input
          {...register('address')}
          id="address"
          type="text"
          placeholder={t('123 Main Street, City')}
          className={INPUT}
        />
      </div>
      <div>
        <label htmlFor="description" className={LABEL}>
          {t('Description')}
        </label>
        <textarea
          {...register('description')}
          id="description"
          placeholder={t('Describe your business...')}
          className={TEXTAREA}
        />
      </div>
      <div>
        <label htmlFor="maps_url" className={LABEL}>
          {t('Google Maps URL')}
        </label>
        <input
          {...register('maps_url')}
          id="maps_url"
          type="text"
          placeholder={t('Paste Google Maps share link')}
          className={INPUT}
        />
      </div>
      <div>
        <label htmlFor="socialProfiles" className={LABEL}>
          {t('Social Profiles')}
        </label>
        <textarea
          {...register('socialProfiles')}
          id="socialProfiles"
          placeholder={t('One URL per line')}
          className={TEXTAREA}
        />
      </div>
      <div>
        <label htmlFor="opening_hours_enabled" className={LABEL}>
          {t('Opening Hours')}
        </label>
        <select
          {...register('opening_hours_enabled')}
          id="opening_hours_enabled"
          className={SELECT}
        >
          <option value="disabled">{t('Disabled')}</option>
          <option value="enabled">{t('Enabled')}</option>
        </select>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          {t('Expiry Date')}
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

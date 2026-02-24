'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { vcardDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
const SECTION =
  'text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4 mt-6'

type VCardDataFormData = z.infer<typeof vcardDataSchema>
interface VCardDataFormProps {
  defaultValues?: Partial<VCardDataFormData>
  onChange?: (data: Partial<VCardDataFormData>) => void
}

export function VCardDataForm({ defaultValues, onChange }: VCardDataFormProps) {
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<VCardDataFormData>({ schema: vcardDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      {/* Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            First Name *
          </label>
          <input {...register('firstName')} id="firstName" type="text" className={INPUT} />
          {errors.firstName && <p className={ERROR}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            Last Name *
          </label>
          <input {...register('lastName')} id="lastName" type="text" className={INPUT} />
          {errors.lastName && <p className={ERROR}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phones" className={LABEL}>
          Phone
        </label>
        <input
          {...register('phones')}
          id="phones"
          type="tel"
          placeholder="+1 234 567 8900"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="emails" className={LABEL}>
          Email
        </label>
        <input
          {...register('emails')}
          id="emails"
          type="email"
          placeholder="john@example.com"
          className={INPUT}
        />
        {errors.emails && <p className={ERROR}>{errors.emails.message}</p>}
      </div>

      <div>
        <label htmlFor="website_list" className={LABEL}>
          Website
        </label>
        <input
          {...register('website_list')}
          id="website_list"
          type="url"
          placeholder="https://example.com"
          className={INPUT}
        />
        {errors.website_list && <p className={ERROR}>{errors.website_list.message}</p>}
      </div>

      {/* Work */}
      <h4 className={SECTION}>Work</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className={LABEL}>
            Company
          </label>
          <input {...register('company')} id="company" type="text" className={INPUT} />
        </div>
        <div>
          <label htmlFor="job" className={LABEL}>
            Job Title
          </label>
          <input {...register('job')} id="job" type="text" className={INPUT} />
        </div>
      </div>

      {/* Address */}
      <h4 className={SECTION}>Address</h4>
      <div>
        <label htmlFor="street" className={LABEL}>
          Street
        </label>
        <input {...register('street')} id="street" type="text" className={INPUT} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="city" className={LABEL}>
            City
          </label>
          <input {...register('city')} id="city" type="text" className={INPUT} />
        </div>
        <div>
          <label htmlFor="zip" className={LABEL}>
            Postal Code
          </label>
          <input {...register('zip')} id="zip" type="text" className={INPUT} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="state" className={LABEL}>
            State / Province
          </label>
          <input {...register('state')} id="state" type="text" className={INPUT} />
        </div>
        <div>
          <label htmlFor="country" className={LABEL}>
            Country
          </label>
          <input {...register('country')} id="country" type="text" className={INPUT} />
        </div>
      </div>
    </form>
  )
}

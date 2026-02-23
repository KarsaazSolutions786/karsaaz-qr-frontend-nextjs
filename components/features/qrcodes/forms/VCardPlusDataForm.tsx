'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { vcardPlusDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-[80px]'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type VCardPlusData = z.infer<typeof vcardPlusDataSchema>
interface VCardPlusDataFormProps { defaultValues?: Partial<VCardPlusData>; onChange?: (data: Partial<VCardPlusData>) => void }
export function VCardPlusDataForm({ defaultValues, onChange }: VCardPlusDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<VCardPlusData>({ schema: vcardPlusDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      {/* Basic Details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Basic Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className={LABEL}>First Name *</label>
            <input {...register('firstName')} id="firstName" type="text" placeholder="John" className={INPUT} />
            {errors.firstName && <p className={ERROR}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={LABEL}>Last Name</label>
            <input {...register('lastName')} id="lastName" type="text" placeholder="Doe" className={INPUT} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phones" className={LABEL}>Phone(s)</label>
            <input {...register('phones')} id="phones" type="text" placeholder="+1 234 567 890" className={INPUT} />
          </div>
          <div>
            <label htmlFor="emails" className={LABEL}>Email(s)</label>
            <input {...register('emails')} id="emails" type="text" placeholder="john@example.com" className={INPUT} />
          </div>
        </div>
        <div>
          <label htmlFor="whatsapp_number" className={LABEL}>WhatsApp Number</label>
          <input {...register('whatsapp_number')} id="whatsapp_number" type="text" placeholder="Include country code, e.g., +1234567890" className={INPUT} />
        </div>
      </fieldset>

      {/* Job Details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Job Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="company" className={LABEL}>Company</label>
            <input {...register('company')} id="company" type="text" placeholder="Acme Inc." className={INPUT} />
          </div>
          <div>
            <label htmlFor="job" className={LABEL}>Job Title</label>
            <input {...register('job')} id="job" type="text" placeholder="Software Engineer" className={INPUT} />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className={LABEL}>Bio</label>
          <textarea {...register('bio')} id="bio" placeholder="Short biography..." className={TEXTAREA} />
        </div>
        <div>
          <label htmlFor="website" className={LABEL}>Website</label>
          <input {...register('website')} id="website" type="url" placeholder="https://johndoe.com" className={INPUT} />
          {errors.website && <p className={ERROR}>{errors.website.message}</p>}
        </div>
      </fieldset>

      {/* Address */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Address</legend>
        <div>
          <label htmlFor="street" className={LABEL}>Street</label>
          <input {...register('street')} id="street" type="text" placeholder="123 Main St" className={INPUT} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="city" className={LABEL}>City</label>
            <input {...register('city')} id="city" type="text" placeholder="New York" className={INPUT} />
          </div>
          <div>
            <label htmlFor="state" className={LABEL}>State</label>
            <input {...register('state')} id="state" type="text" placeholder="NY" className={INPUT} />
          </div>
          <div>
            <label htmlFor="zip" className={LABEL}>ZIP Code</label>
            <input {...register('zip')} id="zip" type="text" placeholder="10001" className={INPUT} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="country" className={LABEL}>Country</label>
            <input {...register('country')} id="country" type="text" placeholder="United States" className={INPUT} />
          </div>
          <div>
            <label htmlFor="maps_url" className={LABEL}>Maps URL</label>
            <input {...register('maps_url')} id="maps_url" type="text" placeholder="Google Maps link" className={INPUT} />
          </div>
        </div>
      </fieldset>

      {/* Opening Hours & Social */}
      <div>
        <label htmlFor="openingHoursEnabled" className={LABEL}>Opening Hours</label>
        <select {...register('openingHoursEnabled')} id="openingHoursEnabled" className={SELECT}>
          <option value="disabled">Disabled</option>
          <option value="enabled">Enabled</option>
        </select>
      </div>
      <div>
        <label htmlFor="socialProfiles" className={LABEL}>Social Profiles</label>
        <textarea {...register('socialProfiles')} id="socialProfiles" placeholder="One URL per line" className={TEXTAREA} />
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}

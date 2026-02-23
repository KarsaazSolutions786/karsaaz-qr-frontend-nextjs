'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { eventDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-[80px]'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type EventData = z.infer<typeof eventDataSchema>
interface EventDataFormProps { defaultValues?: Partial<EventData>; onChange?: (data: Partial<EventData>) => void }
export function EventDataForm({ defaultValues, onChange }: EventDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<EventData>({ schema: eventDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      {/* Basic Details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Basic Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="event_name" className={LABEL}>Event Name *</label>
            <input {...register('event_name')} id="event_name" type="text" placeholder="Annual Conference 2026" className={INPUT} />
            {errors.event_name && <p className={ERROR}>{errors.event_name.message}</p>}
          </div>
          <div>
            <label htmlFor="organizer_name" className={LABEL}>Organizer Name</label>
            <input {...register('organizer_name')} id="organizer_name" type="text" placeholder="Acme Corp" className={INPUT} />
          </div>
        </div>
        <div>
          <label htmlFor="description" className={LABEL}>Description</label>
          <textarea {...register('description')} id="description" placeholder="Describe your event..." className={TEXTAREA} />
        </div>
        <div>
          <label htmlFor="registration_url" className={LABEL}>Registration URL</label>
          <input {...register('registration_url')} id="registration_url" type="url" placeholder="https://..." className={INPUT} />
          {errors.registration_url && <p className={ERROR}>{errors.registration_url.message}</p>}
        </div>
      </fieldset>

      {/* Contact Details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Contact Person</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="contact_name" className={LABEL}>Contact Name</label>
            <input {...register('contact_name')} id="contact_name" type="text" placeholder="Jane Smith" className={INPUT} />
          </div>
          <div>
            <label htmlFor="contact_mobile" className={LABEL}>Contact Phone</label>
            <input {...register('contact_mobile')} id="contact_mobile" type="text" placeholder="+1 234 567 890" className={INPUT} />
          </div>
          <div>
            <label htmlFor="contact_email" className={LABEL}>Contact Email</label>
            <input {...register('contact_email')} id="contact_email" type="email" placeholder="contact@event.com" className={INPUT} />
            {errors.contact_email && <p className={ERROR}>{errors.contact_email.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Location</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="location" className={LABEL}>Venue / Address</label>
            <input {...register('location')} id="location" type="text" placeholder="Convention Center, City" className={INPUT} />
          </div>
          <div>
            <label htmlFor="location_url" className={LABEL}>Map Link</label>
            <input {...register('location_url')} id="location_url" type="text" placeholder="Google Maps URL" className={INPUT} />
          </div>
        </div>
      </fieldset>

      {/* Date & Time */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-gray-900">Date &amp; Time</legend>
        <div>
          <label htmlFor="timezone" className={LABEL}>Timezone</label>
          <input {...register('timezone')} id="timezone" type="text" placeholder="America/New_York" className={INPUT} />
        </div>
      </fieldset>

      {/* Social & Expiry */}
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

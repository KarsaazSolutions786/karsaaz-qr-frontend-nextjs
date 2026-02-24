'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { calendarDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
const SECTION =
  'text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4 mt-6'

type CalendarDataFormData = z.infer<typeof calendarDataSchema>
interface CalendarDataFormProps {
  defaultValues?: Partial<CalendarDataFormData>
  onChange?: (data: Partial<CalendarDataFormData>) => void
}

export function CalendarDataForm({ defaultValues, onChange }: CalendarDataFormProps) {
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<CalendarDataFormData>({ schema: calendarDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="event_name" className={LABEL}>
          Event Name *
        </label>
        <input
          {...register('event_name')}
          id="event_name"
          type="text"
          placeholder="Annual Conference 2025"
          className={INPUT}
        />
        {errors.event_name && <p className={ERROR}>{errors.event_name.message}</p>}
      </div>

      <h4 className={SECTION}>Organizer</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="organizer_name" className={LABEL}>
            Organizer Name
          </label>
          <input
            {...register('organizer_name')}
            id="organizer_name"
            type="text"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="organizer_email" className={LABEL}>
            Organizer Email
          </label>
          <input
            {...register('organizer_email')}
            id="organizer_email"
            type="email"
            className={INPUT}
          />
          {errors.organizer_email && <p className={ERROR}>{errors.organizer_email.message}</p>}
        </div>
      </div>

      <h4 className={SECTION}>Location</h4>
      <div>
        <label htmlFor="location" className={LABEL}>
          Venue Address
        </label>
        <input
          {...register('location')}
          id="location"
          type="text"
          placeholder="123 Main St, City"
          className={INPUT}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="latitude" className={LABEL}>
            Latitude
          </label>
          <input
            {...register('latitude', { valueAsNumber: true })}
            id="latitude"
            type="number"
            step="any"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="longitude" className={LABEL}>
            Longitude
          </label>
          <input
            {...register('longitude', { valueAsNumber: true })}
            id="longitude"
            type="number"
            step="any"
            className={INPUT}
          />
        </div>
      </div>
      <div>
        <label htmlFor="website" className={LABEL}>
          Event Website
        </label>
        <input
          {...register('website')}
          id="website"
          type="url"
          placeholder="https://myevent.com"
          className={INPUT}
        />
        {errors.website && <p className={ERROR}>{errors.website.message}</p>}
      </div>

      <h4 className={SECTION}>Date & Time</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="starts_at" className={LABEL}>
            Start Date & Time *
          </label>
          <input
            {...register('starts_at')}
            id="starts_at"
            type="datetime-local"
            className={INPUT}
          />
          {errors.starts_at && <p className={ERROR}>{errors.starts_at.message}</p>}
        </div>
        <div>
          <label htmlFor="ends_at" className={LABEL}>
            End Date & Time *
          </label>
          <input {...register('ends_at')} id="ends_at" type="datetime-local" className={INPUT} />
          {errors.ends_at && <p className={ERROR}>{errors.ends_at.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="timezone" className={LABEL}>
            Timezone
          </label>
          <input
            {...register('timezone')}
            id="timezone"
            type="text"
            placeholder="America/New_York"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="frequency" className={LABEL}>
            Recurrence
          </label>
          <select {...register('frequency')} id="frequency" className={SELECT}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={LABEL}>
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          placeholder="Additional details about the event..."
          className={TEXTAREA}
        />
      </div>
    </form>
  )
}

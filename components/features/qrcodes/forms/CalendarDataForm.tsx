'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { calendarDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type CalendarDataFormData = z.infer<typeof calendarDataSchema>
interface CalendarDataFormProps { defaultValues?: Partial<CalendarDataFormData>; onChange?: (data: Partial<CalendarDataFormData>) => void }
export function CalendarDataForm({ defaultValues, onChange }: CalendarDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<CalendarDataFormData>({ schema: calendarDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="title" className={LABEL}>Title</label>
        <input {...register('title')} id="title" type="text" className={INPUT} />
        {errors.title && <p className={ERROR}>{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className={LABEL}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea {...register('description')} id="description" rows={3} className={TEXTAREA} />
        {errors.description && <p className={ERROR}>{errors.description.message}</p>}
      </div>
      <div>
        <label htmlFor="location" className={LABEL}>Location <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('location')} id="location" type="text" className={INPUT} />
        {errors.location && <p className={ERROR}>{errors.location.message}</p>}
      </div>
      <div>
        <label htmlFor="startTime" className={LABEL}>Start Time</label>
        <input {...register('startTime')} id="startTime" type="datetime-local" className={INPUT} />
        {errors.startTime && <p className={ERROR}>{errors.startTime.message}</p>}
      </div>
      <div>
        <label htmlFor="endTime" className={LABEL}>End Time</label>
        <input {...register('endTime')} id="endTime" type="datetime-local" className={INPUT} />
        {errors.endTime && <p className={ERROR}>{errors.endTime.message}</p>}
      </div>
    </form>
  )
}

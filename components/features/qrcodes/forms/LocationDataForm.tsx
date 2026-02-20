'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { locationDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type LocationDataFormData = z.infer<typeof locationDataSchema>
interface LocationDataFormProps { defaultValues?: Partial<LocationDataFormData>; onChange?: (data: Partial<LocationDataFormData>) => void }
export function LocationDataForm({ defaultValues, onChange }: LocationDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<LocationDataFormData>({ schema: locationDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="latitude" className={LABEL}>Latitude</label>
        <input {...register('latitude', { valueAsNumber: true })} id="latitude" type="number" step="any" placeholder="e.g. 37.7749" className={INPUT} />
        {errors.latitude && <p className={ERROR}>{errors.latitude.message}</p>}
      </div>
      <div>
        <label htmlFor="longitude" className={LABEL}>Longitude</label>
        <input {...register('longitude', { valueAsNumber: true })} id="longitude" type="number" step="any" placeholder="e.g. -122.4194" className={INPUT} />
        {errors.longitude && <p className={ERROR}>{errors.longitude.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className={LABEL}>Address <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea {...register('address')} id="address" rows={2} placeholder="Optional display address" className={TEXTAREA} />
        {errors.address && <p className={ERROR}>{errors.address.message}</p>}
      </div>
    </form>
  )
}

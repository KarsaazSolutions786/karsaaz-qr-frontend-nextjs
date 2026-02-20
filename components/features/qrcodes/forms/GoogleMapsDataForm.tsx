'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { googleMapsDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type GoogleMapsDataFormData = z.infer<typeof googleMapsDataSchema>
interface GoogleMapsDataFormProps { defaultValues?: Partial<GoogleMapsDataFormData>; onChange?: (data: Partial<GoogleMapsDataFormData>) => void }
export function GoogleMapsDataForm({ defaultValues, onChange }: GoogleMapsDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<GoogleMapsDataFormData>({ schema: googleMapsDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="googlemaps" className={LABEL}>Google Maps URL or Address</label>
        <input {...register('googlemaps')} id="googlemaps" type="text" placeholder="https://maps.google.com/... or a search address" className={INPUT} />
        {errors.googlemaps && <p className={ERROR}>{errors.googlemaps.message}</p>}
      </div>
    </form>
  )
}

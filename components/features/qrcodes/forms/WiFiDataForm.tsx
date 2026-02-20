'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { wifiDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type WiFiDataFormData = z.infer<typeof wifiDataSchema>
interface WiFiDataFormProps { defaultValues?: Partial<WiFiDataFormData>; onChange?: (data: Partial<WiFiDataFormData>) => void }
export function WiFiDataForm({ defaultValues, onChange }: WiFiDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<WiFiDataFormData>({ schema: wifiDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="ssid" className={LABEL}>Network Name (SSID)</label>
        <input {...register('ssid')} id="ssid" type="text" placeholder="My WiFi Network" className={INPUT} />
        {errors.ssid && <p className={ERROR}>{errors.ssid.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className={LABEL}>Password <span className="text-gray-400 font-normal">(optional)</span></label>
        <input {...register('password')} id="password" type="text" placeholder="Leave blank for open networks" className={INPUT} />
      </div>
      <div>
        <label htmlFor="encryption" className={LABEL}>Encryption Type</label>
        <select {...register('encryption')} id="encryption" className={SELECT}>
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open)</option>
        </select>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <input {...register('hidden')} id="hidden" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
        <label htmlFor="hidden" className="text-sm font-medium text-gray-700 cursor-pointer">Hidden network (SSID not broadcast)</label>
      </div>
    </form>
  )
}

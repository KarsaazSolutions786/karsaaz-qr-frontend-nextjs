'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { skypeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const SELECT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type SkypeDataFormData = z.infer<typeof skypeDataSchema>
interface SkypeDataFormProps { defaultValues?: Partial<SkypeDataFormData>; onChange?: (data: Partial<SkypeDataFormData>) => void }
export function SkypeDataForm({ defaultValues, onChange }: SkypeDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<SkypeDataFormData>({
    schema: skypeDataSchema, defaultValues, onChange,
  })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="skype_name" className={LABEL}>Skype Name / ID</label>
        <input {...register('skype_name')} id="skype_name" type="text" placeholder="Your Skype username" className={INPUT} />
        {errors.skype_name && <p className={ERROR}>{errors.skype_name.message}</p>}
      </div>
      <div>
        <label htmlFor="type" className={LABEL}>Action</label>
        <select {...register('type')} id="type" className={SELECT}>
          <option value="chat">Chat</option>
          <option value="call">Call</option>
        </select>
      </div>
    </form>
  )
}

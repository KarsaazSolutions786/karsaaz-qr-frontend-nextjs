'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { linkedinDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type LinkedInDataFormData = z.infer<typeof linkedinDataSchema>
interface LinkedInDataFormProps { defaultValues?: Partial<LinkedInDataFormData>; onChange?: (data: Partial<LinkedInDataFormData>) => void }
export function LinkedInDataForm({ defaultValues, onChange }: LinkedInDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<LinkedInDataFormData>({ schema: linkedinDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="linkedin" className={LABEL}>LinkedIn Profile URL or Username</label>
        <input {...register('linkedin')} id="linkedin" type="text" placeholder="https://linkedin.com/in/username" className={INPUT} />
        {errors.linkedin && <p className={ERROR}>{errors.linkedin.message}</p>}
      </div>
    </form>
  )
}

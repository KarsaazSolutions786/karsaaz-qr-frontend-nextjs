'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { twitterXDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const TEXTAREA =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type TwitterXDataFormData = z.infer<typeof twitterXDataSchema>
interface TwitterXDataFormProps {
  defaultValues?: Partial<TwitterXDataFormData>
  onChange?: (data: Partial<TwitterXDataFormData>) => void
}
export function TwitterXDataForm({ defaultValues, onChange }: TwitterXDataFormProps) {
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<TwitterXDataFormData>({ schema: twitterXDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="x" className={LABEL}>
          X (Twitter) Username or URL
        </label>
        <textarea
          {...register('x')}
          id="x"
          rows={3}
          placeholder="@username or https://x.com/username"
          className={TEXTAREA}
        />
        {errors.x && <p className={ERROR}>{errors.x.message}</p>}
      </div>
    </form>
  )
}

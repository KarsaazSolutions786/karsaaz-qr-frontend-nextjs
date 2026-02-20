'use client'

import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { urlDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type URLDataFormData = z.infer<typeof urlDataSchema>

interface URLDataFormProps {
  defaultValues?: Partial<URLDataFormData>
  onChange?: (data: Partial<URLDataFormData>) => void
}

export function URLDataForm({ defaultValues, onChange }: URLDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<URLDataFormData>({
    schema: urlDataSchema,
    defaultValues,
    onChange,
  })

  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="url" className={LABEL}>Website URL *</label>
        <input
          {...register('url')}
          id="url"
          type="url"
          placeholder="https://example.com"
          className={INPUT}
        />
        {errors.url && <p className={ERROR}>{errors.url.message}</p>}
      </div>
    </form>
  )
}

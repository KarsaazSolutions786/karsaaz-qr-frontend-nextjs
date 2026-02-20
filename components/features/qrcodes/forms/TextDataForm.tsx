'use client'

import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { textDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type TextDataFormData = z.infer<typeof textDataSchema>

interface TextDataFormProps {
  defaultValues?: Partial<TextDataFormData>
  onChange?: (data: Partial<TextDataFormData>) => void
}

export function TextDataForm({ defaultValues, onChange }: TextDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<TextDataFormData>({
    schema: textDataSchema,
    defaultValues,
    onChange,
  })

  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="text" className={LABEL}>Text / URL</label>
        <textarea {...register('text')} id="text" rows={5} placeholder="Enter your text or URL..." className={TEXTAREA} />
        {errors.text && <p className={ERROR}>{errors.text.message}</p>}
      </div>
    </form>
  )
}

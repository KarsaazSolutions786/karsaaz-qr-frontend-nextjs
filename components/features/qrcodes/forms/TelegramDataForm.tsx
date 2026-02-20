'use client'

import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { telegramDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type TelegramDataFormData = z.infer<typeof telegramDataSchema>

const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

interface TelegramDataFormProps {
  defaultValues?: Partial<TelegramDataFormData>
  onChange?: (data: Partial<TelegramDataFormData>) => void
}

export function TelegramDataForm({ defaultValues, onChange }: TelegramDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<TelegramDataFormData>({
    schema: telegramDataSchema,
    defaultValues,
    onChange,
  })

  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="username" className={LABEL}>Telegram Username</label>
        <input {...register('username')} id="username" type="text" placeholder="e.g. myusername (without @)" className={INPUT} />
        {errors.username && <p className={ERROR}>{errors.username.message}</p>}
      </div>
    </form>
  )
}

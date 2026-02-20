'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { telegramDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type TelegramDataFormData = z.infer<typeof telegramDataSchema>

interface TelegramDataFormProps {
  defaultValues?: TelegramDataFormData
  onSubmit: (data: TelegramDataFormData) => void
}

export function TelegramDataForm({ defaultValues, onSubmit }: TelegramDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TelegramDataFormData>({
    resolver: zodResolver(telegramDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Telegram Username or URL</label>
        <input {...register('username')} id="username" type="text" placeholder="e.g. @username or https://t.me/username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
      </div>
    </form>
  )
}

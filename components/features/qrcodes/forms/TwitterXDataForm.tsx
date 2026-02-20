'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { twitterXDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type TwitterXDataFormData = z.infer<typeof twitterXDataSchema>

interface TwitterXDataFormProps {
  defaultValues?: TwitterXDataFormData
  onSubmit: (data: TwitterXDataFormData) => void
}

export function TwitterXDataForm({ defaultValues, onSubmit }: TwitterXDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TwitterXDataFormData>({
    resolver: zodResolver(twitterXDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="x" className="block text-sm font-medium text-gray-700">X (Twitter) Username or URL</label>
        <textarea {...register('x')} id="x" rows={2} placeholder="e.g. @username or https://x.com/username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.x && <p className="mt-1 text-sm text-red-600">{errors.x.message}</p>}
      </div>
    </form>
  )
}

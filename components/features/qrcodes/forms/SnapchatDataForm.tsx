'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { snapchatDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type SnapchatDataFormData = z.infer<typeof snapchatDataSchema>

interface SnapchatDataFormProps {
  defaultValues?: SnapchatDataFormData
  onSubmit: (data: SnapchatDataFormData) => void
}

export function SnapchatDataForm({ defaultValues, onSubmit }: SnapchatDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SnapchatDataFormData>({
    resolver: zodResolver(snapchatDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="snapchat" className="block text-sm font-medium text-gray-700">Snapchat Username</label>
        <input {...register('snapchat')} id="snapchat" type="text" placeholder="e.g. your_username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.snapchat && <p className="mt-1 text-sm text-red-600">{errors.snapchat.message}</p>}
      </div>
    </form>
  )
}

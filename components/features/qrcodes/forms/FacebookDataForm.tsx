'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { facebookDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type FacebookDataFormData = z.infer<typeof facebookDataSchema>

interface FacebookDataFormProps {
  defaultValues?: FacebookDataFormData
  onSubmit: (data: FacebookDataFormData) => void
}

export function FacebookDataForm({ defaultValues, onSubmit }: FacebookDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FacebookDataFormData>({
    resolver: zodResolver(facebookDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook Page URL</label>
        <input {...register('facebook')} id="facebook" type="text" placeholder="e.g. https://facebook.com/yourpage" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.facebook && <p className="mt-1 text-sm text-red-600">{errors.facebook.message}</p>}
      </div>
    </form>
  )
}
